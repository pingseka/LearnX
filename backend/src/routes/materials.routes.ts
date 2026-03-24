import express from 'express';
import { materialsController } from '../controllers/materials.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// 获取所有素材（公开）
router.get('/', materialsController.getAll);

// 获取素材详情（公开）
router.get('/:id', materialsController.getById);

// 上传素材（需要认证）
router.post('/', authMiddleware, materialsController.create);

// 获取用户自己的素材（需要认证）
router.get('/author/me', authMiddleware, materialsController.getByAuthor);

// 更新素材（需要认证）
router.put('/:id', authMiddleware, materialsController.update);

// 删除素材（需要认证）
router.delete('/:id', authMiddleware, materialsController.delete);

export default router;