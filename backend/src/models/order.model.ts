import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user.model';
import { Material } from './material.model';

interface OrderAttributes {
  id: number;
  buyerId: number;
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export class Order extends Model<OrderAttributes> implements OrderAttributes {
  public id!: number;
  public buyerId!: number;
  public totalAmount!: number;
  public status!: 'pending' | 'completed' | 'cancelled';
  public createdAt!: Date;
  public updatedAt!: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'cancelled'),
      defaultValue: 'pending'
    }
  },
  {
    sequelize,
    tableName: 'orders'
  }
);

// 关联关系
Order.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
User.hasMany(Order, { foreignKey: 'buyerId', as: 'orders' });

// 订单详情模型
export class OrderItem extends Model {
  public id!: number;
  public orderId!: number;
  public materialId!: number;
  public quantity!: number;
  public price!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Order,
        key: 'id'
      }
    },
    materialId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Material,
        key: 'id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1
      }
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    }
  },
  {
    sequelize,
    tableName: 'order_items'
  }
);

// 关联关系
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Material, { foreignKey: 'materialId', as: 'material' });