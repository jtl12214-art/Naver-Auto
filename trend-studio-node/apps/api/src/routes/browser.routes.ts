import { Router, Request, Response } from 'express';
import { browserService } from '../browser/browser.service.js';

export const browserRouter = Router();

// GET /api/browser/status - 현재 브라우저 상태 조회
browserRouter.get('/status', (_req: Request, res: Response) => {
  const status = browserService.getStatus();
  res.status(200).json({
    success: true,
    data: status,
  });
});

// POST /api/browser/open - 독립 Chrome 브라우저 실행 (forceRestart 옵션 지원)
browserRouter.post('/open', async (req: Request, res: Response) => {
  try {
    const forceRestart = Boolean(req.body?.forceRestart);
    const result = await browserService.openBrowser(forceRestart);
    res.status(200).json({
      success: true,
      message: result.message,
      data: result,
    });
  } catch (error: any) {
    const status = browserService.getStatus();
    res.status(500).json({
      success: false,
      error: {
        code: 'BROWSER_LAUNCH_FAILED',
        message: error?.message || 'Chrome 브라우저 실행에 실패했습니다.',
      },
      data: status,
    });
  }
});

// POST /api/browser/verify - 사용자 화면 표시 확인 결과 등록
browserRouter.post('/verify', (req: Request, res: Response) => {
  const verified = Boolean(req.body?.verified);
  const result = browserService.setUiVerified(verified);
  res.status(200).json({
    success: true,
    message: verified ? '화면 표시 확인 완료' : '화면 미표시 접수',
    data: result,
  });
});

// POST /api/browser/close - Chrome 브라우저 닫기
browserRouter.post('/close', async (_req: Request, res: Response) => {
  try {
    const result = await browserService.closeBrowser();
    res.status(200).json({
      success: true,
      message: 'Chrome 창이 정상 종료되었습니다.',
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        code: 'BROWSER_CLOSE_FAILED',
        message: error?.message || 'Chrome 브라우저 종료 중 오류가 발생했습니다.',
      },
    });
  }
});
