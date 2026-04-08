/**
 * Unified API response helper
 */
export interface ApiResponse<T = any> {
  code: number;
  data: T | null;
  msg: string;
}

export function success<T>(data: T, msg: string = 'success'): ApiResponse<T> {
  return { code: 0, data, msg };
}

export function error(msg: string, code: number = 1): ApiResponse<null> {
  return { code, data: null, msg };
}
