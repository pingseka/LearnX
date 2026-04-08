export * from './auth';
export * from './materials';
export * from './orders';
export * from './earnings';

export interface ApiResponse<T> {
  code: number;
  data: T | null;
  msg: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}