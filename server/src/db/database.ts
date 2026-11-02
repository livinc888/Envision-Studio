import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';
import dns from 'node:dns';
import { fileURLToPath } from 'node:url';

// Configure public DNS fallback to resolve MongoDB Atlas SRV records on Windows
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch {
  // Ignore in restricted environments
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure .env is loaded from server directory or root directory
const envPaths = [
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'server/.env')
];

for (const p of envPaths) {
  if (fs.existsSync(p)) {
    dotenv.config({ path: p });
    break;
  }
}

export function getMongoURI(): string {
  return process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/envision_studio';
}

function maskURI(uri: string): string {
  return uri.replace(/:([^@:]+)@/, ':****@');
}

export async function connectDB(uri?: string): Promise<typeof mongoose> {
  const connectionUri = uri || getMongoURI();

  if (mongoose.connection.readyState >= 1) {
    return mongoose;
  }

  try {
    await mongoose.connect(connectionUri);
    console.log(`[MongoDB] Connected successfully to ${maskURI(connectionUri)}`);
    return mongoose;
  } catch (error) {
    console.error(`[MongoDB] Connection error to ${maskURI(connectionUri)}:`, error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    console.log('[MongoDB] Disconnected successfully');
  }
}

export default mongoose;
