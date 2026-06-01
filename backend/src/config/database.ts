import { DataTypes, Sequelize } from 'sequelize';
import { env } from './env';
import { logger } from '../utils/logger';

// 创建 Sequelize 实例（使用SQLite）
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: env.DB_STORAGE,
  logging: (message) => logger.debug('database_query', { query: message })
});

// 测试数据库连接
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    logger.info('database_connected', { dialect: 'sqlite' });
  } catch (error: any) {
    logger.error('database_connection_failed', error);
    throw error;
  }
};

// 同步数据库模型
export const syncDB = async () => {
  try {
    await sequelize.sync();

    const queryInterface = sequelize.getQueryInterface();
    const tables = await queryInterface.showAllTables();
    if (tables.includes('materials')) {
      const materials = await queryInterface.describeTable('materials');
      if (!materials.status) {
        await queryInterface.addColumn('materials', 'status', {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'pending'
        });
      }
    }

    logger.info('database_synchronized');
  } catch (error) {
    logger.error('database_synchronization_failed', error);
    throw error;
  }
};
