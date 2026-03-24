import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user.model';
import { Order } from './order.model';

interface EarningsAttributes {
  id: number;
  userId: number;
  amount: number;
  source: 'sale' | 'referral';
  orderId: number | null;
  createdAt: Date;
}

export class Earnings extends Model<EarningsAttributes> implements EarningsAttributes {
  public id!: number;
  public userId!: number;
  public amount!: number;
  public source!: 'sale' | 'referral';
  public orderId!: number | null;
  public createdAt!: Date;
}

Earnings.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    source: {
      type: DataTypes.ENUM('sale', 'referral'),
      allowNull: false
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Order,
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'earnings'
  }
);

// 关联关系
Earnings.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Earnings, { foreignKey: 'userId', as: 'earnings' });

Earnings.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });