import { Earnings } from '../models/earnings.model';
import { Op } from 'sequelize';
import { Order, OrderItem } from '../models/order.model';
import { Material } from '../models/material.model';
import { User } from '../models/user.model';

interface EarningsStats {
  total: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

export const earningsService = {
  getStats: async (userId: string): Promise<EarningsStats> => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    // 获取总收益
    const totalResult = await Earnings.sum('amount', {
      where: { userId: Number(userId) }
    });
    const total = totalResult || 0;

    // 获取周收益
    const weeklyResult = await Earnings.sum('amount', {
      where: { 
        userId: Number(userId),
        createdAt: { [Op.gte]: oneWeekAgo }
      }
    });
    const weekly = weeklyResult || 0;

    // 获取月收益
    const monthlyResult = await Earnings.sum('amount', {
      where: { 
        userId: Number(userId),
        createdAt: { [Op.gte]: oneMonthAgo }
      }
    });
    const monthly = monthlyResult || 0;

    // 获取年收益
    const yearlyResult = await Earnings.sum('amount', {
      where: { 
        userId: Number(userId),
        createdAt: { [Op.gte]: oneYearAgo }
      }
    });
    const yearly = yearlyResult || 0;

    return {
      total,
      weekly,
      monthly,
      yearly
    };
  },

  getDetails: async (userId: string, page: number = 1, limit: number = 10) => {
    const { count, rows } = await Earnings.findAndCountAll({
      where: { userId: Number(userId) },
      include: [
        {
          model: Order,
          as: 'order',
          attributes: ['id', 'buyerId', 'totalAmount', 'status', 'createdAt'],
          include: [
            {
              model: User,
              as: 'buyer',
              attributes: ['id', 'name', 'email']
            },
            {
              model: OrderItem,
              as: 'items',
              include: [
                {
                  model: Material,
                  as: 'material',
                  attributes: ['id', 'title', 'price', 'fileUrl']
                }
              ]
            }
          ]
        }
      ],
      limit,
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']]
    });

    return {
      earnings: rows,
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit)
    };
  }
};
