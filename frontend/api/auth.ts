import { fetchApi, uploadFile } from './index';

// 认证相关类型
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'creator' | 'buyer';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string | null;
  role: 'user' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

// 注册函数
export async function register(data: RegisterData): Promise<AuthResponse> {
  return fetchApi<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 登录函数
export async function login(data: LoginData): Promise<AuthResponse> {
  return fetchApi<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// 获取个人资料函数
export async function getProfile(): Promise<UserProfile> {
  return fetchApi<UserProfile>('/auth/profile');
}

export async function updateProfile(data: { name: string }): Promise<UserProfile> {
  return fetchApi<UserProfile>('/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function uploadAvatar(file: File): Promise<UserProfile> {
  const formData = new FormData();
  formData.append('avatar', file);
  return uploadFile<UserProfile>('/auth/avatar', formData);
}

export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> {
  return fetchApi<{ message: string }>('/auth/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// 保存token到本地存储
export function saveToken(token: string): void {
  localStorage.setItem('token', token);
}

// 从本地存储获取token
export function getToken(): string | null {
  return localStorage.getItem('token');
}

// 从本地存储移除token
export function removeToken(): void {
  localStorage.removeItem('token');
}

// 检查是否已登录
export function isAuthenticated(): boolean {
  return !!getToken();
}
