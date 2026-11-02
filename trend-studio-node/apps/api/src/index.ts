import http from 'http';
import dotenv from 'dotenv';
import { createApp } from './server/app.js';
import { browserService } from './browser/browser.service.js';
import { SERVER_METADATA, writeInstanceFile, removeInstanceFile } from './server/metadata.js';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3001', 10);
const HOST = process.env.HOST || '127.0.0.1';

// Prevent sudden unhandled crashes
process.on('uncaughtException', (error) => {
  console.error('[API FATAL] Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[API FATAL] Unhandled Rejection at:', promise, 'reason:', reason);
});

const app = createApp();
const server = http.createServer(app);

server.listen(PORT, HOST, () => {
  writeInstanceFile();
  console.log('====================================================');
  console.log(`[NAVER Trend Studio API] Server running successfully!`);
  console.log(`- API URL: http://${HOST}:${PORT}`);
  console.log(`- Health Endpoint: http://${HOST}:${PORT}/api/health`);
  console.log(`- Backend PID: ${SERVER_METADATA.backendPid} (Instance: ${SERVER_METADATA.instanceId})`);
  console.log(`- Time: ${new Date().toLocaleString()}`);

  const locked = browserService.isProfileLocked();
  if (locked) {
    console.warn(`[API WARNING] ChromeProfile is currently locked by another process.`);
  } else {
    console.log(`- Chrome Profile: Available (Ready to launch)`);
  }
  console.log('====================================================');
});

server.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n[API ERROR] Port ${PORT} is already in use!`);
    console.error(`다른 프로세스가 이미 포트 ${PORT}을 점유하고 있습니다.`);
    console.error(`기존 프로세스를 종료하거나 start.bat으로 다시 시작해 주세요.\n`);
  } else {
    console.error('[API SERVER ERROR]', error);
  }
});

// Graceful shutdown: Clean up active browser context before exit
const shutdown = async () => {
  console.log('\n[API] Gracefully shutting down server...');
  removeInstanceFile();
  try {
    await browserService.closeBrowser();
  } catch {
    // Ignore
  }
  server.close(() => {
    console.log('[API] Server closed.');
    process.exit(0);
  });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('exit', () => {
  removeInstanceFile();
});
