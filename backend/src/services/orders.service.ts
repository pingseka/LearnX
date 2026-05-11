import { Order, OrderItem } from '../models/order.model';
import { Material } from '../models/material.model';
import { Earnings } from '../models/earnings.model';
import { User } from '../models/user.model';
import { sequelize } from '../config/database';

interface CreateOrderData {
  materials: Array<{
    materialId: string | number;
    quantity: number;
  }>;
  buyer: string | number;
}

export const ordersService = {
  create: async (data: CreateOrderData) => {
    return sequelize.transaction(async (transaction) => {
      let totalAmount = 0;
      const orderItems: Array<{
        materialId: number;
        authorId: number;
        quantity: number;
        price: number;
        subtotal: number;
      }> = [];

      for (const item of data.materials) {
        const material = await Material.findByPk(Number(item.materialId), {
          transaction,
        });

        if (!material) {
          throw new Error(`素材 ${item.materialId} 不存在`);
        }

        if (material.status !== 'approved') {
          throw new Error('资料未通过审核，暂不能购买');
        }

        const quantity = Number(item.quantity);
        if (!Number.isInteger(quantity) || quantity < 1) {
          throw new Error('购买数量不正确');
        }

        const price = Number(material.price);
        const subtotal = price * quantity;
        totalAmount += subtotal;

        orderItems.push({
          materialId: material.id,
          authorId: material.authorId,
          quantity,
          price,
          subtotal
        });
      }

      const order = await Order.create(
        {
          buyerId: Number(data.buyer),
          totalAmount,
          status: 'completed'
        },
        { transaction }
      );

      for (const item of orderItems) {
        await OrderItem.create(
          {
            orderId: order.id,
            materialId: item.materialId,
            quantity: item.quantity,
            price: item.price
          },
          { transaction }
        );

        const authorEarnings = item.subtotal * 0.9;
        if (authorEarnings > 0) {
          await Earnings.create(
            {
              userId: item.authorId,
              amount: authorEarnings,
              source: 'sale',
              orderId: order.id
            },
            { transaction }
          );
        }
      }

      const orderWithItems = await Order.findByPk(order.id, {
        include: [
          {
            model: OrderItem,
            as: 'items',
            include: [
              {
                model: Material,
                as: 'material',
                attributes: ['id', 'title', 'price', 'fileUrl', 'authorId'],
                include: [
                  {
                    model: User,
                    as: 'author',
                    attributes: ['id', 'name', 'email']
                  }
                ]
              }
            ]
          }
        ],
        transaction
      });

      return orderWithItems;
    });
  },

  getByBuyer: async (buyerId: string, page: number = 1, limit: number = 10) => {
    const { count, rows } = await Order.findAndCountAll({
      where: { buyerId: Number(buyerId) },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Material,
              as: 'material',
              attributes: ['id', 'title', 'price', 'fileUrl', 'authorId'],
              include: [
                {
                  model: User,
                  as: 'author',
                  attributes: ['id', 'name', 'email']
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
      orders: rows,
      total: count,
      page,
      limit,
      pages: Math.ceil(count / limit)
    };
  },

  getById: async (id: string, userId: string) => {
    const order = await Order.findByPk(Number(id), {
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Material,
              as: 'material',
              include: [
                {
                  model: User,
                  as: 'author',
                  attributes: ['id', 'name', 'email']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!order) {
      throw new Error('订单不存在');
    }

    // 检查权限（只能查看自己的订单）
    if (order.buyerId !== Number(userId)) {
      throw new Error('无权限查看此订单');
    }

    return order;
  },

  updateStatus: async (id: string, status: 'pending' | 'completed' | 'cancelled', userId: string) => {
    const order = await Order.findByPk(Number(id));
    if (!order) {
      throw new Error('订单不存在');
    }

    // 检查权限（只能更新自己的订单）
    if (order.buyerId !== Number(userId)) {
      throw new Error('无权限更新此订单');
    }

    order.status = status;
    await order.save();

    return order;
  }
};
