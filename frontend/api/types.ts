// 统一导出所有API类型

// 认证相关类型
export * from './auth';

// 素材相关类型
export * from './materials';

// 订单相关类型
export * from './orders';

// 收益相关类型
export * from './earnings';

// 通用响应类型
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}