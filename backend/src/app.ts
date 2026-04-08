import express from 'express';
import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { env } from './config/env';
import { connectDB, syncDB } from './config/database';
import corsMiddleware from './config/cors';
import { errorMiddleware } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import materialsRoutes from './routes/materials.routes';
import ordersRoutes from './routes/orders.routes';
import earningsRoutes from './routes/earnings.routes';

const app = express();

// 确保 uploads 目录存在
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    code: 1,
    data: null,
    msg: 'Too many requests, please try again later',
  },
});

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
app.use(morgan('dev'));
app.use('/api', limiter);

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 路由
app.use('/api/auth', authRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/earnings', earningsRoutes);

// 错误处理中间件
app.use(errorMiddleware);

// 启动服务器
const startServer = async () => {
  try {
    // 连接数据库
    await connectDB();
    
    // 同步数据库模型
    await syncDB();
    
    // 启动服务器
    app.listen(env.PORT, () => {
      console.log(`Server is running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();