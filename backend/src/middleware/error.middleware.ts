import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { error } from '../utils/response';
import { logger } from '../utils/logger';

export const errorMiddleware: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';

  logger.error('request_failed', err, {
    method: req.method,
    path: req.originalUrl,
    statusCode,
  });
  
  res.status(statusCode).json(error(message));
};
