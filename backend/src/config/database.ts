import { DataTypes, Sequelize } from 'sequelize';

// 创建 Sequelize 实例（使用SQLite）
export const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: console.log
});

// 测试数据库连接
export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('SQLite connected successfully');
  } catch (error: any) {
    console.error('SQLite connection error:', error);
    process.exit(1);
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

    console.log('Database synchronized');
  } catch (error) {
    console.error('Database synchronization error:', error);
    process.exit(1);
  }
};
