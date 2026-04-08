import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { authService } from '../services/auth.service';
import { success, error as apiError } from '../utils/response';

export const authController = {
  register: [
    // 验证请求数据
    body('email').isEmail().withMessage('请提供有效的邮箱地址'),
    body('password').isLength({ min: 6 }).withMessage('密码长度至少为6位'),
    body('name').notEmpty().withMessage('请提供姓名'),
    
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // 检查验证错误
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json(apiError(errors.array().map(e => e.msg).join('; ')));
        }

        const { email, password, name } = req.body;
        const result = await authService.register({ email, password, name });
        
        res.status(201).json(success(result));
      } catch (error) {
        next(error);
      }
    }
  ],

  login: [
    // 验证请求数据
    body('email').isEmail().withMessage('请提供有效的邮箱地址'),
    body('password').notEmpty().withMessage('请提供密码'),
    
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // 检查验证错误
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json(apiError(errors.array().map(e => e.msg).join('; ')));
        }

        const { email, password } = req.body;
        const result = await authService.login({ email, password });
        
        res.status(200).json(success(result, 'Login successful'));
      } catch (error) {
        next(error);
      }
    }
  ],

  getProfile: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user.userId;
      const user = await authService.getUserById(userId);
      
      res.status(200).json(success({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }));
    } catch (error) {
      next(error);
    }
  }
};
