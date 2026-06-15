import express from 'express';
import { authController } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

// 注册
router.post('/register', authController.register);

// 登录
router.post('/login', authController.login);

// 获取个人资料（需要认证）
router.get('/profile', authMiddleware, authController.getProfile);

// 更新个人资料（需要认证）
router.put('/profile', authMiddleware, authController.updateProfile);

// 上传头像（需要认证）
router.post('/avatar', authMiddleware, authController.updateAvatar);

// 修改密码（需要认证）
router.put('/password', authMiddleware, authController.changePassword);

export default router;
