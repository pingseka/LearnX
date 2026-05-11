import dotenv from 'dotenv';

const result = dotenv.config();
if (result.error) {
  console.error('Error loading .env file:', result.error);
}

const generateDevSecret = (): string => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET environment variable is required in production');
  }
  try {
    return require('crypto').randomBytes(32).toString('hex');
  } catch {
    return 'development-only-secret-change-in-production-' + Date.now();
  }
};

export const env = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '3306'),
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'material_management',
  JWT_SECRET: process.env.JWT_SECRET || generateDevSecret(),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  UPLOAD_DIR: process.env.UPLOAD_DIR || './public/uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '52428800'),
  AI_PROVIDER: process.env.AI_PROVIDER || 'deepseek',
  AI_API_KEY: process.env.AI_API_KEY || '',
  AI_BASE_URL: process.env.AI_BASE_URL || 'https://api.deepseek.com/v1',
  AI_MODEL: process.env.AI_MODEL || 'deepseek-chat'
};