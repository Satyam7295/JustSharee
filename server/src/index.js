import { app } from "./app.js";
import dotenv from "dotenv"
import connectDB from "./db/index.js"
import fileRoutes from "./routes/file.routes.js"
import userRoutes from "./routes/user.routes.js"
import qrRoutes from "./routes/qr.routes.js";
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.resolve();

import express from "express"
import cors from "cors"
import { File } from "./models/file.models.js";

const __filename = fileURLToPath(import.meta.url);
const moduleDir = path.dirname(__filename);
dotenv.config({ path: path.resolve(moduleDir, "../.env") });

const PORT=process.env.PORT || 6600;

      
const startServer = async () => {
     try {
    await connectDB();

    // Register routes
    app.use("/api/files", fileRoutes);
    app.use("/api/users", userRoutes); // 👈 Now you can use /api/users endpoints
    app.use("/api/qr", qrRoutes); // 👈 QR code generation endpoint

    app.use(express.static(path.join(__dirname, '/client')));

app.get('/f/:shortCode', async (req, res) => {

      const { shortCode } = req.params;
      if (!shortCode) {
        return res.status(400).send('Short code is required');
      }
      console.log("Short code:", shortCode);
      // Handle the download logic here
      try {
         const file = await File.findOne({ shortUrl: `/f/${shortCode}` });
          if (!file) {
            return res.status(404).send('File not found');
          }
          // just return that all file info
         res.json(file);
      } catch (error) {
        console.error("Error fetching file:", error);
        res.status(500).send('Internal Server Error');
      }

});

    // Global error handling middleware (ensures all errors return JSON instead of HTML 500)
    app.use((err, _req, res, _next) => {
      console.error("Global Server Error:", err);
      if (err?.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ error: "File too large. Maximum size is 10 MB." });
      }
      if (err?.message?.includes("Unsupported file type")) {
        return res.status(400).json({ error: err.message.replace(/^❌\s*/, "") });
      }
      if (err?.name === "MulterError") {
        return res.status(400).json({ error: err.message });
      }
      return res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
    });

    app.listen(PORT, () => {
      console.log(`✅ Server is running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error starting server:", error);
  }
  };
  
  startServer();