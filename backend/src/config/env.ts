import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const readSecret = (name: string) => {
  const value = process.env[name];
  const file = process.env[`${name}_FILE`];

  if (value && file) {
    throw new Error(`${name} and ${name}_FILE cannot both be set`);
  }

  if (file) {
    return fs.readFileSync(file, 'utf8').trim();
  }

  return value || '';
};

const requireProductionSecret = (name: string, value: string) => {
  if (process.env.NODE_ENV === 'production' && !value) {
    throw new Error(`${name} is required in production`);
  }

  return value;
};

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
  DB_STORAGE: process.env.DB_STORAGE || './database.sqlite',
  JWT_SECRET: requireProductionSecret(
    'JWT_SECRET',
    readSecret('JWT_SECRET') || generateDevSecret()
  ),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '52428800'),
  APP_VERSION: process.env.APP_VERSION || '1.0.0',
  MONITORING_TOKEN: requireProductionSecret(
    'MONITORING_TOKEN',
    readSecret('MONITORING_TOKEN')
  ),
  AI_PROVIDER: process.env.AI_PROVIDER || 'deepseek',
  AI_API_KEY: process.env.AI_API_KEY || '',
  AI_BASE_URL: process.env.AI_BASE_URL || 'https://api.deepseek.com/v1',
  AI_MODEL: process.env.AI_MODEL || 'deepseek-chat'
};
