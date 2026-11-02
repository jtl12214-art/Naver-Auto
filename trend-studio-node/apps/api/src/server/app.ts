import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { healthRouter } from '../routes/health.routes.js';
import { browserRouter } from '../routes/browser.routes.js';

export function createApp(): Express {
  const app = express();

  // Middleware
  app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  }));
  app.use(express.json());

  // Request logger for debugging
  app.use((req: Request, _res: Response, next: NextFunction) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[API ${timestamp}] ${req.method} ${req.url}`);
    next();
  });

  // Routes
  app.use('/api', healthRouter);
  app.use('/api/browser', browserRouter);

  // 404 Handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `API endpoint not found: ${req.method} ${req.url}`,
      },
    });
  });

  // Global Error Handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[API ERROR]', err);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: err?.message || 'Internal server error occurred',
      },
    });
  });

  return app;
}
