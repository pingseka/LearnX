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
  logging: env.NODE_ENV === 'development' ? console.log : false,
  // 自动创建数据库
  dialectOptions: {
    connectTimeout: 10000
  }
});

// 测试数据库连接
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected successfully');
  } catch (error: any) {
    console.error('MySQL connection error:', error);
    
    // 如果是数据库不存在的错误，尝试创建数据库
    if (error.original && error.original.sqlState === '42000') {
      console.log('Database not found, trying to create it...');
      try {
        // 创建数据库
        const createDbSequelize = new Sequelize({
          host: env.DB_HOST,
          port: env.DB_PORT,
          username: env.DB_USER,
          password: env.DB_PASSWORD,
          dialect: 'mysql',
          logging: false
        });
        
        await createDbSequelize.query(`CREATE DATABASE IF NOT EXISTS ${env.DB_NAME}`);
        await createDbSequelize.close();
        console.log('Database created successfully');
        
        // 重新连接
        await sequelize.authenticate();
        console.log('MySQL connected successfully after creating database');
      } catch (createError) {
        console.error('Failed to create database:', createError);
        process.exit(1);
      }
    } else {
      console.log('提示：请确保MySQL服务已启动，并且数据库配置正确');
      console.log('配置文件位置：backend/.env');
      console.log('或者，您可以修改database.ts文件使用SQLite作为替代方案');
      process.exit(1);
    }
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