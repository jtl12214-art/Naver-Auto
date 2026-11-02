/**
 * NAVER Trend Studio - Chrome Smoke Test Script
 * 
 * 목적: 웹 대시보드나 Express 서버를 거치지 않고,
 * 사용자의 실제 Windows 데스크톱 터미널에서 Playwright가 Google Chrome 창을
 * 시각적(GUI)으로 정상 렌더링하는지 단독 검증합니다.
 */

import path from 'path';
import os from 'os';
import fs from 'fs';
import readline from 'readline';
import { chromium } from 'playwright';

async function runSmokeTest() {
  console.log('====================================================');
  console.log(' [NAVER Trend Studio] 독립 Chrome 단독 실행 스모크 테스트');
  console.log('====================================================');
  console.log(`- Node.js PID: ${process.pid}`);
  console.log(`- 실행 시각: ${new Date().toLocaleString()}`);

  // 1. 독립 테스트 프로필 디렉토리 구성 (%LOCALAPPDATA%/TrendStudio/ChromeSmokeTest)
  const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
  const testProfilePath = path.join(localAppData, 'TrendStudio', 'ChromeSmokeTest');

  if (!fs.existsSync(testProfilePath)) {
    fs.mkdirSync(testProfilePath, { recursive: true });
  }
  console.log(`- 테스트 전용 프로필 경로: ${testProfilePath}`);

  console.log('\n[1/3] Google Chrome 브라우저 실행 시도 중 (headless: false, channel: "chrome")...');

  let context;
  try {
    context = await chromium.launchPersistentContext(testProfilePath, {
      headless: false,
      channel: 'chrome', // 시스템에 설치된 실제 Google Chrome 실행
      viewport: null, // 브라우저 창 본래 크기 유지
      chromiumSandbox: true, // Chrome 공식 보안 샌드박스 활성화 (--no-sandbox 경고 방지)
      args: [
        '--window-size=1280,860',
        '--window-position=100,100', // 화면 밖 배치 방지
        '--no-first-run',
        '--no-default-browser-check',
      ],
    });
  } catch (launchErr) {
    console.error('\n❌ Chrome 실행 실패:');
    console.error(launchErr);
    process.exit(1);
  }

  console.log('[2/3] 페이지 생성 및 네이버 크리에이터 어드바이저 접속 중...');

  const pages = context.pages();
  const page = pages.length > 0 ? pages[0] : await context.newPage();

  const targetUrl = 'https://creator-advisor.naver.com/';
  try {
    await page.goto(targetUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000,
    });
    await page.bringToFront();
  } catch (navErr) {
    console.warn(`[주의] 페이지 로딩 중 지연 발생: ${navErr.message}`);
  }

  const currentUrl = page.url();
  const title = await page.title().catch(() => '확인 불가');

  console.log('[3/3] 브라우저 실행 및 페이지 로드 완료!');
  console.log(`- 접속된 URL: ${currentUrl}`);
  console.log(`- 페이지 제목: ${title}`);

  console.log('\n----------------------------------------------------');
  console.log('👉 [확인 요청] 지금 Windows 바탕화면 / 작업표시줄에');
  console.log('   새로운 Google Chrome 창이 실제로 보이시나요?');
  console.log('----------------------------------------------------');
  console.log('결과를 확인하신 후, 브라우저를 닫으려면 [Enter] 키를 누르세요...');

  // 사용자가 엔터를 누를 때까지 대기
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  await new Promise((resolve) => {
    rl.question('', () => {
      rl.close();
      resolve(null);
    });
  });

  console.log('\nChrome 브라우저를 정상 종료합니다...');
  await context.close();
  console.log('✅ 테스트가 안전하게 종료되었습니다.');
  process.exit(0);
}

runSmokeTest().catch((err) => {
  console.error('\n❌ 테스트 중 치명적 오류 발생:', err);
  process.exit(1);
});
