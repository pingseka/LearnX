const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, '');

export function getApiUrl(endpoint: string): string {
  return `${API_BASE_URL}${endpoint}`;
}

// Unified backend response type
export interface BackendResponse<T = any> {
  code: number;
  data: T | null;
  msg: string;
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(getApiUrl(endpoint), {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const json: BackendResponse<T> = await response.json().catch(() => ({
      code: 1,
      data: null,
      msg: `Request failed: ${response.status}`,
    }));

    if (!response.ok || json.code !== 0) {
      throw new Error(json.msg || `Request failed: ${response.status}`);
    }

    return json.data as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('请求超时，请确认后端服务正常运行');
    }
    if (err instanceof TypeError && /fetch/i.test(err.message)) {
      throw new Error('无法连接后端服务，请确认后台已启动后刷新页面');
    }
    throw err;
  }
}

export async function uploadFile<T>(
  endpoint: string,
  formData: FormData
): Promise<T> {
  const headers: HeadersInit = {};

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(getApiUrl(endpoint), {
      method: 'POST',
      headers,
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const json: BackendResponse<T> = await response.json().catch(() => ({
      code: 1,
      data: null,
      msg: `Upload failed: ${response.status}`,
    }));

    if (!response.ok || json.code !== 0) {
      throw new Error(json.msg || `Upload failed: ${response.status}`);
    }

    return json.data as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new Error('上传超时，请确认后端服务正常运行');
    }
    if (err instanceof TypeError && /fetch/i.test(err.message)) {
      throw new Error('无法连接后端服务，请确认后台已启动后刷新页面');
    }
    throw err;
  }
}

export function getAssetUrl(path?: string | null): string | null {
  if (!path) {
    return null;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}
