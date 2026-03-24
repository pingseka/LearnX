import { Sequelize } from 'sequelize';
import { env } from './env';

// 创建 Sequelize 实例
export const sequelize = new Sequelize({
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  dialect: 'mysql',
  logging: env.NODE_ENV === 'development' ? console.log : false
});

// 测试数据库连接
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully');
  } catch (error) {
    console.error('MySQL connection error:', error);
    process.exit(1);
  }
};

// 同步数据库模型
export const syncDB = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Database synchronization error:', error);
    process.exit(1);
  }
};