import { Request, Response, NextFunction } from 'express';
import { authorsService } from '../services/authors.service';
import { success } from '../utils/response';

export const authorsController = {
  getPublicProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authorsService.getPublicProfile(req.params.id);
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  }
};
