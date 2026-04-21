import dotenv from 'dotenv';

// 调试：打印dotenv加载结果
const result = dotenv.config();
if (result.error) {
  console.error('Error loading .env file:', result.error);
} else {
  console.log('Environment variables loaded successfully');
  console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'NOT SET');
  console.log('DB_USER:', process.env.DB_USER);
  console.log('DB_NAME:', process.env.DB_NAME);
}

export const env = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  // MySQL 配置
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '3306'),
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'material_management',
  // JWT 配置
  JWT_SECRET: process.env.JWT_SECRET || 'default-secret-key',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  // 文件上传配置
  UPLOAD_DIR: process.env.UPLOAD_DIR || './public/uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '52428800'), // 50MB
  // AI 配置
  AI_PROVIDER: process.env.AI_PROVIDER || 'deepseek',
  AI_API_KEY: process.env.AI_API_KEY || '',
  AI_BASE_URL: process.env.AI_BASE_URL || 'https://api.deepseek.com/v1',
  AI_MODEL: process.env.AI_MODEL || 'deepseek-chat'
};