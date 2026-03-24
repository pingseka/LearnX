import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';
import { User } from './user.model';

interface MaterialAttributes {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
  thumbnailUrl: string | null;
  category: string;
  price: number;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Material extends Model<MaterialAttributes> implements MaterialAttributes {
  public id!: number;
  public title!: string;
  public description!: string;
  public fileUrl!: string;
  public thumbnailUrl!: string | null;
  public category!: string;
  public price!: number;
  public authorId!: number;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Material.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: false
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id'
      }
    }
  },
  {
    sequelize,
    tableName: 'materials'
  }
);

// 关联关系
Material.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
User.hasMany(Material, { foreignKey: 'authorId', as: 'materials' });