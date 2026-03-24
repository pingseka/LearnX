import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { materialsService } from '../services/materials.service';
import { upload } from '../utils/upload';

export const materialsController = {
  create: [
    // 文件上传中间件
    upload.fields([
      { name: 'file', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 }
    ]),
    
    // 验证请求数据
    body('title').notEmpty().withMessage('请提供标题'),
    body('description').notEmpty().withMessage('请提供描述'),
    body('category').notEmpty().withMessage('请提供分类'),
    body('price').isNumeric().withMessage('请提供有效的价格'),
    
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // 检查验证错误
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        // 检查文件是否上传
        if (!req.files || !('file' in req.files)) {
          return res.status(400).json({ message: '请上传文件' });
        }

        const file = (req.files as any).file[0];
        const thumbnail = (req.files as any).thumbnail?.[0];
        const { title, description, category, price, tags } = req.body;
        const authorId = (req as any).user.userId;

        const result = await materialsService.create({
          title,
          description,
          fileUrl: `/uploads/${file.filename}`,
          thumbnailUrl: thumbnail ? `/uploads/${thumbnail.filename}` : undefined,
          category,
          price: parseFloat(price),
          author: authorId,
          tags: tags ? tags.split(',') : []
        });

        res.status(201).json(result);
      } catch (error) {
        next(error);
      }
    }
  ],

  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const category = req.query.category as string;
      const search = req.query.search as string;

      const result = await materialsService.getAll(page, limit, category, search);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const result = await materialsService.getById(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  getByAuthor: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authorId = (req as any).user.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await materialsService.getByAuthor(authorId, page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  update: [
    // 文件上传中间件
    upload.fields([
      { name: 'file', maxCount: 1 },
      { name: 'thumbnail', maxCount: 1 }
    ]),
    
    // 验证请求数据
    body('title').optional().notEmpty().withMessage('请提供标题'),
    body('description').optional().notEmpty().withMessage('请提供描述'),
    body('category').optional().notEmpty().withMessage('请提供分类'),
    body('price').optional().isNumeric().withMessage('请提供有效的价格'),
    
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        // 检查验证错误
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const authorId = (req as any).user.userId;
        const { title, description, category, price, tags } = req.body;
        const file = (req.files as any)?.file?.[0];
        const thumbnail = (req.files as any)?.thumbnail?.[0];

        const updateData: any = {};
        if (title) updateData.title = title;
        if (description) updateData.description = description;
        if (category) updateData.category = category;
        if (price) updateData.price = parseFloat(price);
        if (tags) updateData.tags = tags.split(',');
        if (file) updateData.fileUrl = `/uploads/${file.filename}`;
        if (thumbnail) updateData.thumbnailUrl = `/uploads/${thumbnail.filename}`;

        const result = await materialsService.update(id, updateData, authorId);
        res.status(200).json(result);
      } catch (error) {
        next(error);
      }
    }
  ],

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const authorId = (req as any).user.userId;

      const result = await materialsService.delete(id, authorId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
};