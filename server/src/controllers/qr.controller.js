import { generateQRCodeDataURL } from "../utils/qrCode.js";

/**
 * Controller for GET /api/qr?data=<value>
 * 
 * Validates that the 'data' query parameter is present.
 * Uses generateQRCodeDataURL to generate a Base64 data URL.
 * Returns { qrCode: "data:image/png;base64,..." } on success.
 * Returns 400 if 'data' is missing or empty.
 * Returns 500 if generation fails.
 */
export const getQRCode = async (req, res) => {
  const { data } = req.query;

  if (!data || typeof data !== "string" || !data.trim()) {
    return res.status(400).json({ error: "Data query parameter is required" });
  }

  try {
    const qrCode = await generateQRCodeDataURL(data);
    return res.status(200).json({ qrCode });
  } catch (error) {
    console.error("QR code generation error:", error.message || error);
    return res.status(500).json({ error: "Failed to generate QR code" });
  }
};
