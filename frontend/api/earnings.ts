import { fetchApi } from './index';

// 收益相关类型
export interface EarningsStats {
  total: number;
  weekly: number;
  monthly: number;
  yearly: number;
}

export interface EarningsDetail {
  id: number;
  materialId: number;
  material: {
    id: number;
    title: string;
  };
  orderId: number;
  order?: {
    id: number;
    buyer?: {
      id: number;
      name?: string;
      email?: string;
    };
    items?: Array<{
      material?: {
        id: number;
        title: string;
        price: number;
        fileUrl?: string;
      };
    }>;
  };
  amount: number;
  createdAt: string;
}

// 获取收益统计
export async function getEarningsStats(): Promise<EarningsStats> {
  return fetchApi<EarningsStats>('/earnings/stats');
}

// 获取收益详情
export async function getEarningsDetails(params?: {
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}): Promise<{ earnings: EarningsDetail[]; total: number }> {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  }
  
  const queryString = queryParams.toString();
  const endpoint = `/earnings/details${queryString ? `?${queryString}` : ''}`;
  
  return fetchApi<{ earnings: EarningsDetail[]; total: number }>(endpoint);
}
