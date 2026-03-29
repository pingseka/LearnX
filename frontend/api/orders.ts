import { fetchApi } from './index';

// 订单相关类型
export interface OrderItem {
  id: number;
  orderId: number;
  materialId: number;
  material: {
    id: number;
    title: string;
    price: number;
    fileUrl: string;
  };
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  buyerId: number;
  buyer: {
    id: number;
    username: string;
  };
  totalAmount: number;
  status: 'pending' | 'completed' | 'cancelled';
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: {
    materialId: number;
    quantity: number;
  }[];
}

export interface UpdateOrderStatusData {
  status: 'pending' | 'completed' | 'cancelled';
}

// 创建订单
export async function createOrder(data: CreateOrderData): Promise<Order> {
  return fetchApi<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 获取订单列表
export async function getOrders(params?: {
  page?: number;
  limit?: number;
  status?: 'pending' | 'completed' | 'cancelled';
}): Promise<{ orders: Order[]; total: number }> {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  }
  
  const queryString = queryParams.toString();
  const endpoint = `/orders${queryString ? `?${queryString}` : ''}`;
  
  return fetchApi<{ orders: Order[]; total: number }>(endpoint);
}

// 获取订单详情
export async function getOrderById(id: number): Promise<Order> {
  return fetchApi<Order>(`/orders/${id}`);
}

// 更新订单状态
export async function updateOrderStatus(id: number, data: UpdateOrderStatusData): Promise<Order> {
  return fetchApi<Order>(`/orders/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}