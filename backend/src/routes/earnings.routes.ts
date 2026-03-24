import express from 'express';
import { earningsController } from '../controllers/earnings.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// 获取收益统计（需要认证）
router.get('/stats', authMiddleware, earningsController.getStats);

// 获取收益详情（需要认证）
router.get('/details', authMiddleware, earningsController.getDetails);

export default router;