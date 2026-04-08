import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { error } from '../utils/response';

export const errorMiddleware: ErrorRequestHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.message);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || '服务器内部错误';
  
  res.status(statusCode).json(error(message));
};