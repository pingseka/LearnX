import express from 'express';
import { ordersController } from '../controllers/orders.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// 创建订单（需要认证）
router.post('/', authMiddleware, ordersController.create);

// 获取用户自己的订单（需要认证）
router.get('/', authMiddleware, ordersController.getByBuyer);

// 获取订单详情（需要认证）
router.get('/:id', authMiddleware, ordersController.getById);

// 更新订单状态（需要认证）
router.put('/:id/status', authMiddleware, ordersController.updateStatus);

export default router;