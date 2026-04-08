import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { ordersService } from '../services/orders.service';
import { success, error as apiError } from '../utils/response';

export const ordersController = {
  create: [
    // 验证请求数据
    body('materials').isArray().withMessage('请提供素材列表'),
    body('materials.*.materialId').notEmpty().withMessage('请提供素材ID'),
    body('materials.*.quantity').isNumeric().withMessage('请提供有效的数量'),
    
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // 检查验证错误
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json(apiError(errors.array().map(e => e.msg).join('; ')));
        }

        const { materials } = req.body;
        const buyerId = (req as any).user.userId;

        const result = await ordersService.create({ materials, buyer: buyerId });
        res.status(201).json(success(result));
      } catch (error) {
        next(error);
      }
    }
  ],

  getByBuyer: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const buyerId = (req as any).user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await ordersService.getByBuyer(buyerId, page, limit);
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const userId = (req as any).user.userId;

      const result = await ordersService.getById(id, userId);
      res.status(200).json(success(result));
    } catch (error) {
      next(error);
    }
  },

  updateStatus: [
    // 验证请求数据
    body('status').isIn(['pending', 'completed', 'cancelled']).withMessage('请提供有效的状态'),
    
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // 检查验证错误
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json(apiError(errors.array().map(e => e.msg).join('; ')));
        }

        const { id } = req.params;
        const { status } = req.body;
        const userId = (req as any).user.userId;

        const result = await ordersService.updateStatus(id, status as 'pending' | 'completed' | 'cancelled', userId);
        res.status(200).json(success(result));
      } catch (error) {
        next(error);
      }
    }
  ]
};