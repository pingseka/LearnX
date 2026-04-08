const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
      throw new Error('Request timeout');
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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
      throw new Error('Upload timeout');
    }
    throw err;
  }
}