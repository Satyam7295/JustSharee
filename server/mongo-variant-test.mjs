import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import { DB_NAME } from './src/constant.js';

const __filename = fileURLToPath(import.meta.url);
const moduleDir = path.dirname(__filename);
dotenv.config({ path: path.resolve(moduleDir, '.env') });

const raw = (process.env.MONGODB_URL || process.env.MONGODB_URI).trim().replace(/^['"]|['"]$/g, '');

const isLikelyHostname = (value) => value.split('.').length >= 3;

function withDb(uri) {
  const q = uri.indexOf('?');
  const base = q === -1 ? uri : uri.slice(0, q);
  const query = q === -1 ? '' : uri.slice(q + 1);
  const segments = base.split('/');
  const hasDb = segments.length > 3 && Boolean(segments.at(-1));
  if (hasDb) return uri;
  const withDbBase = `${base.replace(/\/+$/, '')}/${DB_NAME}`;
  return query ? `${withDbBase}?${query}` : withDbBase;
}

function variantEncodedPassword(uri) {
  const protocolMatch = uri.match(/^(mongodb(?:\+srv)?:\/\/)/);
  if (!protocolMatch) return uri;
  const protocol = protocolMatch[1];
  const rest = uri.slice(protocol.length);
  const q = rest.indexOf('?');
  const hostAndPath = q === -1 ? rest : rest.slice(0, q);
  const query = q === -1 ? '' : rest.slice(q + 1);
  const lastAt = hostAndPath.lastIndexOf('@');
  const credentials = hostAndPath.slice(0, lastAt);
  const hostOnly = hostAndPath.slice(lastAt + 1);
  const colonIdx = credentials.indexOf(':');
  const user = decodeURIComponent(credentials.slice(0, colonIdx));
  const pass = decodeURIComponent(credentials.slice(colonIdx + 1));
  const rebuilt = `${protocol}${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${hostOnly}`;
  return withDb(query ? `${rebuilt}?${query}` : rebuilt);
}

function variantMisplacedDb(uri) {
  const protocolMatch = uri.match(/^(mongodb(?:\+srv)?:\/\/)/);
  if (!protocolMatch) return uri;
  const protocol = protocolMatch[1];
  const rest = uri.slice(protocol.length);
  const q = rest.indexOf('?');
  const hostAndPath = q === -1 ? rest : rest.slice(0, q);
  const query = q === -1 ? '' : rest.slice(q + 1);
  const atParts = hostAndPath.split('@');
  if (atParts.length < 3) return withDb(uri);
  const hostPart = atParts.at(-1);
  const middlePart = atParts.at(-2);
  const credentialPart = atParts.slice(0, -2).join('@');
  if (isLikelyHostname(middlePart) || !isLikelyHostname(hostPart.split('/')[0])) return withDb(uri);
  const colonIdx = credentialPart.indexOf(':');
  const user = decodeURIComponent(credentialPart.slice(0, colonIdx));
  const pass = decodeURIComponent(credentialPart.slice(colonIdx + 1));
  const rebuilt = `${protocol}${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${hostPart}`;
  return withDb(query ? `${rebuilt}?${query}` : rebuilt);
}

for (const [name, fn] of [
  ['raw_with_db', (u) => withDb(u)],
  ['encoded_password', variantEncodedPassword],
  ['misplaced_db', variantMisplacedDb],
]) {
  try {
    await mongoose.connect(fn(raw), { serverSelectionTimeoutMS: 8000 });
    console.log(name, 'OK', mongoose.connection.host, mongoose.connection.name);
    await mongoose.disconnect();
  } catch (e) {
    console.log(name, 'FAIL', e.message);
  }
}
