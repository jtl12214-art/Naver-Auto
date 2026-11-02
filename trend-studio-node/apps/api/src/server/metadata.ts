import fs from 'fs';
import path from 'path';

export const SERVER_METADATA = {
  backendPid: process.pid,
  instanceId: `api_${Date.now()}_${process.pid}`,
  startedAt: new Date().toISOString(),
  serverPort: parseInt(process.env.PORT || '3001', 10),
};

const INSTANCE_FILE = path.resolve(process.cwd(), '.server-instance.json');

export function writeInstanceFile(): void {
  try {
    fs.writeFileSync(INSTANCE_FILE, JSON.stringify(SERVER_METADATA, null, 2), 'utf-8');
  } catch (err) {
    // Non-fatal
  }
}

export function removeInstanceFile(): void {
  try {
    if (fs.existsSync(INSTANCE_FILE)) {
      fs.unlinkSync(INSTANCE_FILE);
    }
  } catch (err) {
    // Non-fatal
  }
}
