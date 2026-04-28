import { ordersService } from '../../src/services/orders.service';

jest.mock('../../src/models/order.model', () => ({
  Order: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findAndCountAll: jest.fn()
  },
  OrderItem: {
    create: jest.fn()
  }
}));

jest.mock('../../src/models/material.model', () => ({
  Material: {
    findByPk: jest.fn()
  }
}));

jest.mock('../../src/models/earnings.model', () => ({
  Earnings: {
    create: jest.fn()
  }
}));

const { Order, OrderItem } = require('../../src/models/order.model');
const { Material } = require('../../src/models/material.model');
const { Earnings } = require('../../src/models/earnings.model');

describe('ordersService', () => {
  const mockMaterial = {
    id: 1,
    title: 'Test Material',
    price: 100,
    authorId: 2
  };

  const mockOrder = {
    id: 1,
    buyerId: 1,
    totalAmount: 200,
    status: 'pending',
    save: jest.fn().mockResolvedValue(true)
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create order successfully', async () => {
      (Material.findByPk as jest.Mock).mockResolvedValue(mockMaterial);
      (Order.create as jest.Mock).mockResolvedValue(mockOrder);
      (OrderItem.create as jest.Mock).mockResolvedValue({});
      (Earnings.create as jest.Mock).mockResolvedValue({});
      (Order.findByPk as jest.Mock).mockResolvedValue({
        ...mockOrder,
        items: []
      });

      const result = await ordersService.create({
        materials: [{ materialId: '1', quantity: 2 }],
        buyer: '1'
      });

      expect(Material.findByPk).toHaveBeenCalledWith(1);
      expect(Order.create).toHaveBeenCalledWith({
        buyerId: 1,
        totalAmount: 200,
        status: 'pending'
      });
      expect(OrderItem.create).toHaveBeenCalled();
      expect(Earnings.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw error if material not found', async () => {
      (Material.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(ordersService.create({
        materials: [{ materialId: '999', quantity: 1 }],
        buyer: '1'
      })).rejects.toThrow('素材 999 不存在');
    });
  });

  describe('getByBuyer', () => {
    it('should return orders for buyer', async () => {
      (Order.findAndCountAll as jest.Mock).mockResolvedValue({
        count: 1,
        rows: [mockOrder]
      });

      const result = await ordersService.getByBuyer('1');

      expect(Order.findAndCountAll).toHaveBeenCalled();
      expect(result.orders).toHaveLength(1);
      expect(result.total).toBe(1);
    });
  });

  describe('getById', () => {
    it('should return order by id when user has permission', async () => {
      (Order.findByPk as jest.Mock).mockResolvedValue(mockOrder);

      const result = await ordersService.getById('1', '1');

      expect(Order.findByPk).toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });

    it('should throw error if order not found', async () => {
      (Order.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(ordersService.getById('999', '1')).rejects.toThrow('订单不存在');
    });

    it('should throw error if user has no permission', async () => {
      (Order.findByPk as jest.Mock).mockResolvedValue(mockOrder);

      await expect(ordersService.getById('1', '2')).rejects.toThrow('无权限查看此订单');
    });
  });

  describe('updateStatus', () => {
    it('should update order status', async () => {
      (Order.findByPk as jest.Mock).mockResolvedValue(mockOrder);

      const result = await ordersService.updateStatus('1', 'completed', '1');

      expect(Order.findByPk).toHaveBeenCalled();
      expect(mockOrder.save).toHaveBeenCalled();
      expect(mockOrder.status).toBe('completed');
    });

    it('should throw error if order not found', async () => {
      (Order.findByPk as jest.Mock).mockResolvedValue(null);

      await expect(ordersService.updateStatus('999', 'completed', '1')).rejects.toThrow('订单不存在');
    });

    it('should throw error if user has no permission', async () => {
      (Order.findByPk as jest.Mock).mockResolvedValue(mockOrder);

      await expect(ordersService.updateStatus('1', 'completed', '2')).rejects.toThrow('无权限更新此订单');
    });
  });
});