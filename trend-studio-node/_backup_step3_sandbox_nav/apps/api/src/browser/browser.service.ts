import path from 'path';
import os from 'os';
import fs from 'fs';
import { execSync } from 'child_process';
import { chromium, BrowserContext, Page } from 'playwright';
import { BrowserStatus, BrowserStatusResponse } from '@trend-studio/shared';

const TARGET_URL = 'https://creator-advisor.naver.com/';

/**
 * Helper to identify active root Chrome process using the dedicated TrendStudio profile
 */
function findActiveChromeProcess(profilePath: string): { pid: number; sessionId?: number } | null {
  try {
    const norm = profilePath.replace(/\//g, '\\');
    const psCmd = `Get-CimInstance -ClassName Win32_Process -Filter "Name = 'chrome.exe'" | Where-Object { $_.CommandLine -like '*${norm}*' -and $_.CommandLine -notlike '*--type=*' } | Select-Object -First 1 ProcessId, SessionId | ConvertTo-Json`;
    const out = execSync(`powershell -NoProfile -Command "${psCmd}"`, { timeout: 3000, encoding: 'utf8' }).trim();
    if (!out) return null;
    const parsed = JSON.parse(out);
    return {
      pid: parsed.ProcessId,
      sessionId: parsed.SessionId,
    };
  } catch {
    return null;
  }
}

export class BrowserService {
  private static instance: BrowserService;
  private context: BrowserContext | null = null;
  private activePage: Page | null = null;
  private status: BrowserStatus = 'DISCONNECTED';
  private statusMessage: string = 'Chrome 실행 전';
  private lastError: string | null = null;
  private connectedAt: string | null = null;
  private uiVerified: boolean = false;
  private chromePid: number | undefined;
  private chromeSessionId: number | undefined;
  private readonly profilePath: string;

  private constructor() {
    const localAppData = process.env.LOCALAPPDATA || path.join(os.homedir(), 'AppData', 'Local');
    this.profilePath = path.join(localAppData, 'TrendStudio', 'ChromeProfile');
  }

  public static getInstance(): BrowserService {
    if (!BrowserService.instance) {
      BrowserService.instance = new BrowserService();
    }
    return BrowserService.instance;
  }

  public getProfilePath(): string {
    return this.profilePath;
  }

  public getStatus(): BrowserStatusResponse {
    let currentUrl: string | undefined;
    try {
      if (this.activePage && !this.activePage.isClosed()) {
        currentUrl = this.activePage.url();
      }
    } catch {
      // Ignore
    }

    return {
      status: this.status,
      message: this.statusMessage,
      connectedAt: this.connectedAt || undefined,
      profilePath: this.profilePath,
      currentUrl,
      channel: 'chrome',
      error: this.lastError,
      uiVerified: this.uiVerified,
      chromePid: this.chromePid,
      chromeSessionId: this.chromeSessionId,
    };
  }

  public setUiVerified(verified: boolean): BrowserStatusResponse {
    this.uiVerified = verified;
    if (verified) {
      this.statusMessage = '사용자 화면에 Chrome 창 표시 확인 완료';
    } else {
      this.statusMessage = 'Chrome 프로세스 구동됨 (사용자 화면에서 창 확인 필요)';
    }
    return this.getStatus();
  }

  /**
   * Safe native check: Verifies if Chrome profile is occupied by an active process,
   * with secondary non-destructive file lock verification.
   * Does NOT delete any user profile data or indiscriminately remove lockfiles.
   */
  public isProfileLocked(): boolean {
    // 1. Primary: Check if an active Chrome process is currently using this profile
    const activeProc = findActiveChromeProcess(this.profilePath);
    if (activeProc) {
      console.warn(`[BrowserService] Chrome profile is actively used by Chrome PID ${activeProc.pid}`);
      return true;
    }

    // 2. Secondary: If no active Chrome is found, check if lockfiles are held open by another process
    const testFiles = ['lockfile', 'SingletonLock'];
    for (const file of testFiles) {
      const fullPath = path.join(this.profilePath, file);
      if (fs.existsSync(fullPath)) {
        try {
          const fd = fs.openSync(fullPath, 'r+');
          fs.closeSync(fd);
        } catch (err: any) {
          if (err.code === 'EBUSY' || err.code === 'EPERM' || err.code === 'EACCES') {
            return true;
          }
        }
      }
    }
    return false;
  }

  public async openBrowser(forceRestart: boolean = false): Promise<BrowserStatusResponse> {
    // 1. Prevent concurrent launching
    if (this.status === 'LAUNCHING') {
      return {
        ...this.getStatus(),
        message: 'Chrome 창을 실행하고 있습니다. 잠시만 기다려 주세요.',
      };
    }

    // 2. Check if already managed in this instance
    if (this.status === 'BROWSER_OPEN' && this.context) {
      if (forceRestart) {
        console.log('[BrowserService] Force restart requested. Closing existing context...');
        await this.closeBrowser();
      } else {
        try {
          if (this.activePage && !this.activePage.isClosed()) {
            await this.activePage.bringToFront();
            return {
              ...this.getStatus(),
              message: 'Chrome 창이 이미 열려 있습니다. 화면에 보이지 않는 경우 [Chrome 창 다시 열기]를 클릭하세요.',
            };
          }
        } catch {
          await this.closeBrowser();
        }
      }
    }

    // 3. Pre-flight check: Is profile directory locked by an external Chrome instance?
    if (this.isProfileLocked()) {
      console.warn('[BrowserService] Chrome profile directory is locked by another process.');
      this.status = 'ERROR';
      const msg = 'Chrome 운영 프로필이 다른 프로세스에 의해 잠겨 있습니다. 이전 실행 창이나 백그라운드 작업을 닫은 후 다시 시도해 주세요.';
      this.lastError = msg;
      this.statusMessage = msg;
      throw new Error(msg);
    }

    this.status = 'LAUNCHING';
    this.statusMessage = 'Google Chrome 창을 실행하는 중입니다...';
    this.lastError = null;
    this.uiVerified = false;

    try {
      // 4. Ensure operational directory exists (without touching cookies or user data)
      if (!fs.existsSync(this.profilePath)) {
        fs.mkdirSync(this.profilePath, { recursive: true });
      }

      console.log(`[BrowserService] Launching Chrome with profile: ${this.profilePath}`);

      // 5. Launch Persistent Context with exact options validated for desktop display
      this.context = await chromium.launchPersistentContext(this.profilePath, {
        headless: false,
        channel: 'chrome',
        viewport: null,
        args: [
          '--window-size=1280,860',
          '--window-position=100,100',
          '--no-first-run',
          '--no-default-browser-check',
        ],
      });

      // 6. Handle browser context close event
      this.context.on('close', () => {
        console.log('[BrowserService] Chrome context closed.');
        this.context = null;
        this.activePage = null;
        this.status = 'DISCONNECTED';
        this.statusMessage = 'Chrome 창이 정상 종료되었습니다 (DISCONNECTED).';
        this.uiVerified = false;
        this.chromePid = undefined;
        this.chromeSessionId = undefined;
      });

      // 7. Page creation & navigation
      const pages = this.context.pages();
      this.activePage = pages.length > 0 ? pages[0] : await this.context.newPage();

      this.activePage.on('close', () => {
        console.log('[BrowserService] Active page closed.');
        if (this.context && this.context.pages().filter((p) => !p.isClosed()).length === 0) {
          this.closeBrowser().catch(() => {});
        }
      });

      console.log(`[BrowserService] Navigating to ${TARGET_URL}`);
      await this.activePage.goto(TARGET_URL, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });

      await this.activePage.bringToFront().catch(() => {});

      // 8. Capture actual Chrome PID
      const activeChrome = findActiveChromeProcess(this.profilePath);
      this.chromePid = activeChrome?.pid;
      this.chromeSessionId = activeChrome?.sessionId;

      this.status = 'BROWSER_OPEN';
      this.statusMessage = 'Chrome 프로세스 구동됨 (사용자 화면에서 창 확인 필요)';
      this.connectedAt = new Date().toISOString();
      this.lastError = null;
      this.uiVerified = false;

      console.log(`[BrowserService] Chrome launched successfully (PID: ${this.chromePid || 'Unknown'}).`);
      return this.getStatus();
    } catch (err: any) {
      console.error('[BrowserService] Failed to launch Chrome:', err);

      this.status = 'ERROR';
      let friendlyError = err?.message || '알 수 없는 브라우저 실행 오류가 발생했습니다.';

      if (friendlyError.includes('ProcessSingleton') || friendlyError.includes('Lock file can not be created') || friendlyError.includes('lock')) {
        friendlyError = 'Chrome 프로필이 잠겨 있습니다. 이전 실행 창이나 백그라운드 Chrome 프로세스를 닫은 후 다시 시도해 주세요.';
      } else if (friendlyError.includes('Executable doesn\'t exist') || friendlyError.includes('channel "chrome"')) {
        friendlyError = 'Google Chrome이 시스템에 설치되어 있지 않거나 경로를 찾을 수 없습니다.';
      }

      this.lastError = friendlyError;
      this.statusMessage = `Chrome 실행 실패: ${friendlyError}`;
      this.chromePid = undefined;
      this.chromeSessionId = undefined;

      if (this.context) {
        try {
          await this.context.close();
        } catch {
          // Ignore
        }
        this.context = null;
        this.activePage = null;
      }

      throw new Error(friendlyError);
    }
  }

  public async closeBrowser(): Promise<BrowserStatusResponse> {
    console.log('[BrowserService] Closing Chrome browser context...');
    try {
      if (this.context) {
        await this.context.close();
      }
    } catch (err: any) {
      console.warn('[BrowserService] Warning during browser close:', err?.message);
    } finally {
      this.context = null;
      this.activePage = null;
      this.status = 'DISCONNECTED';
      this.statusMessage = 'Chrome 창이 정상적으로 닫혔습니다 (DISCONNECTED).';
      this.connectedAt = null;
      this.uiVerified = false;
      this.chromePid = undefined;
      this.chromeSessionId = undefined;
    }

    return this.getStatus();
  }
}

export const browserService = BrowserService.getInstance();
