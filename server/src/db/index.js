import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const moduleDir = path.dirname(__filename);
dotenv.config({ path: path.resolve(moduleDir, "../../.env") });

const isLikelyHostname = (value) => value.split(".").length >= 3;

const encodeMongoCredentials = (uri) => {
  const protocolMatch = uri.match(/^(mongodb(?:\+srv)?:\/\/)/);
  if (!protocolMatch) return uri;

  const protocol = protocolMatch[1];
  const rest = uri.slice(protocol.length);
  const queryIndex = rest.indexOf("?");
  const hostAndPath = queryIndex === -1 ? rest : rest.slice(0, queryIndex);
  const queryString = queryIndex === -1 ? "" : rest.slice(queryIndex + 1);
  const atParts = hostAndPath.split("@");

  if (atParts.length >= 3) {
    const hostPart = atParts.at(-1);
    const middlePart = atParts.at(-2);
    const credentialPart = atParts.slice(0, -2).join("@");

    if (!isLikelyHostname(middlePart) && isLikelyHostname(hostPart.split("/")[0])) {
      const colonIdx = credentialPart.indexOf(":");
      if (colonIdx !== -1) {
        const username = decodeURIComponent(credentialPart.slice(0, colonIdx));
        const password = decodeURIComponent(credentialPart.slice(colonIdx + 1));
        const encodedUser = encodeURIComponent(username);
        const encodedPass = encodeURIComponent(password);
        const rebuiltHost = `${encodedUser}:${encodedPass}@${hostAndPath.slice(hostAndPath.indexOf(hostPart))}`;
        return queryString
          ? `${protocol}${rebuiltHost}?${queryString}`
          : `${protocol}${rebuiltHost}`;
      }
    }
  }

  const lastAt = hostAndPath.lastIndexOf("@");
  if (lastAt === -1) return uri;

  const credentials = hostAndPath.slice(0, lastAt);
  const hostOnly = hostAndPath.slice(lastAt + 1);
  const colonIdx = credentials.indexOf(":");
  if (colonIdx === -1) return uri;

  const username = decodeURIComponent(credentials.slice(0, colonIdx));
  const password = decodeURIComponent(credentials.slice(colonIdx + 1));
  const encodedUser = encodeURIComponent(username);
  const encodedPass = encodeURIComponent(password);

  if (credentials === `${encodedUser}:${encodedPass}`) {
    return queryString ? `${protocol}${hostAndPath}?${queryString}` : `${protocol}${hostAndPath}`;
  }

  const rebuilt = `${protocol}${encodedUser}:${encodedPass}@${hostOnly}`;
  return queryString ? `${rebuilt}?${queryString}` : rebuilt;
};

const buildMongoUri = () => {
  const rawUri = process.env.MONGODB_URL || process.env.MONGODB_URI;
  if (!rawUri) {
    throw new Error("MONGODB_URL (or MONGODB_URI) is not configured");
  }

  const sanitizedUri = rawUri.trim().replace(/^['\"]|['\"]$/g, "");
  if (!sanitizedUri.startsWith("mongodb://") && !sanitizedUri.startsWith("mongodb+srv://")) {
    throw new Error("Mongo URI must start with mongodb:// or mongodb+srv://");
  }

  return encodeMongoCredentials(sanitizedUri);
};

const connectDB = async () => {
  try {
    const mongoUri = buildMongoUri();
    const connectionInstance = await mongoose.connect(mongoUri, {
      dbName: DB_NAME,
    });
    console.log(`MongoDB connected at host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    throw error;
  }
};

export default connectDB;
