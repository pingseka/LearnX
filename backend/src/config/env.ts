import dotenv from 'dotenv';

dotenv.config();

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
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '52428800') // 50MB
};