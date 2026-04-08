import { Order, OrderItem } from '../models/order.model';
import { Material } from '../models/material.model';
import { Earnings } from '../models/earnings.model';

interface CreateOrderData {
  materials: Array<{
    materialId: string;
    quantity: number;
  }>;
  buyer: string;
}

export const ordersService = {
  create: async (data: CreateOrderData) => {
    let totalAmount = 0;
    const orderItems: any[] = [];

    // 验证素材存在并计算总金额
    for (const item of data.materials) {
      const material = await Material.findByPk(Number(item.materialId));
      if (!material) {
        throw new Error(`素材 ${item.materialId} 不存在`);
      }

      const subtotal = Number(material.price) * item.quantity;
      totalAmount += subtotal;

      orderItems.push({
        materialId: material.id,
        authorId: material.authorId,
        quantity: item.quantity,
        price: material.price,
        subtotal
      });
    }

    // 创建订单
    const order = await Order.create({
      buyerId: Number(data.buyer),
      totalAmount,
      status: 'pending'
    });

    // 创建订单详情
    for (const item of orderItems) {
      await OrderItem.create({
        orderId: order.id,
        materialId: item.materialId,
        quantity: item.quantity,
        price: item.price
      });
    }

    // 创建收益记录（平台抽成10%，作者获得90%）
    for (const item of orderItems) {
      const authorEarnings = item.subtotal * 0.9;
      await Earnings.create({
        userId: item.authorId,
        amount: authorEarnings,
        source: 'sale',
        orderId: order.id
      });
    }

    // 重新获取包含详情的订单
    const orderWithItems = await Order.findByPk(order.id, {
      include: [
        { 
          model: OrderItem, 
          as: 'items',
          include: [{ model: Material, as: 'material', attributes: ['id', 'title', 'price'] }]
        }
      ]
    });

    return orderWithItems;
  },

  getByBuyer: async (buyerId: string, page: number = 1, limit: number = 10) => {
    const { count, rows } = await Order.findAndCountAll({
      where: { buyerId: Number(buyerId) },
      include: [
        { 
          model: OrderItem, 
          as: 'items',
          include: [{ model: Material, as: 'material', attributes: ['id', 'title', 'price'] }]
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
        { model: OrderItem, as: 'items', include: [{ model: Material, as: 'material' }] }
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