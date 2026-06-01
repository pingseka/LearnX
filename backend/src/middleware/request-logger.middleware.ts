import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { recordRequest } from '../services/metrics.service';
import { logger } from '../utils/logger';

export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestId = req.header('x-request-id') || randomUUID();
  const startedAt = process.hrtime.bigint();

  res.setHeader('X-Request-Id', requestId);

  res.on('finish', () => {
    const durationMs =
      Number(process.hrtime.bigint() - startedAt) / 1_000_000;

    recordRequest(res.statusCode, durationMs);
    logger.info('http_request', {
      requestId,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      durationMs: Math.round(durationMs * 100) / 100,
      ip: req.ip,
    });
  });

  next();
};
