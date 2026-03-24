import { Request, Response, NextFunction } from 'express';
import { earningsService } from '../services/earnings.service';

export const earningsController = {
  getStats: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.userId;
      const result = await earningsService.getStats(userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  getDetails: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await earningsService.getDetails(userId, page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};