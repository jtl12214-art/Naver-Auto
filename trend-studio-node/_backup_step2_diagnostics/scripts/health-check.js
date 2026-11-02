/**
 * NAVER Trend Studio - Health Check & Browser Opener Script
 * Used by start.bat to verify API + Frontend readiness and launch browser.
 */
const http = require('http');
const { exec } = require('child_process');

const API_URL = 'http://127.0.0.1:3001/api/health';
const FRONTEND_URL = 'http://localhost:5173/';
const SHOULD_OPEN = process.argv.includes('--open');
const MAX_ATTEMPTS = 40;
const INTERVAL_MS = 1000;

console.log('[HealthCheck] Waiting for NAVER Trend Studio servers to become ready...');

let attempts = 0;

function checkUrl(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1200, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function verifyAll() {
  attempts++;
  const apiReady = await checkUrl(API_URL);
  const frontendReady = await checkUrl(FRONTEND_URL);

  if (apiReady && frontendReady) {
    console.log('[HealthCheck] SUCCESS: Backend (:3001) and Frontend (:5173) are both ready!');
    if (SHOULD_OPEN) {
      console.log('[HealthCheck] Opening browser: ' + FRONTEND_URL);
      exec('start http://localhost:5173', (err) => {
        if (err) console.error('[HealthCheck] Error opening browser:', err.message);
        process.exit(0);
      });
      return;
    }
    process.exit(0);
  }

  if (attempts >= MAX_ATTEMPTS) {
    console.error(`[HealthCheck] TIMEOUT: Servers did not respond within ${MAX_ATTEMPTS} seconds.`);
    process.exit(1);
  }

  setTimeout(verifyAll, INTERVAL_MS);
}

verifyAll();
