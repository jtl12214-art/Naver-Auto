import { Router, Request, Response } from 'express';
import { HealthCheckResponse } from '@trend-studio/shared';

export const healthRouter = Router();

const startTime = Date.now();

healthRouter.get('/health', (_req: Request, res: Response) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000);

  const response: HealthCheckResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: uptimeSeconds,
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0-mvp'
  };

  res.status(200).json(response);
});
