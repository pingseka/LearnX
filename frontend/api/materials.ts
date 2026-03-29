import { fetchApi, uploadFile } from './index';

// 素材相关类型
export interface Tag {
  id: number;
  name: string;
}

export interface Material {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  fileUrl: string;
  thumbnailUrl: string;
  authorId: number;
  author: {
    id: number;
    username: string;
  };
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMaterialData {
  title: string;
  description: string;
  price: number;
  category: string;
  tags: string[];
  file: File;
  thumbnail: File;
}

export interface UpdateMaterialData {
  title?: string;
  description?: string;
  price?: number;
  category?: string;
  tags?: string[];
  file?: File;
  thumbnail?: File;
}

// 获取素材列表
export async function getMaterials(params?: {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
}): Promise<{ materials: Material[]; total: number }> {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  }
  
  const queryString = queryParams.toString();
  const endpoint = `/materials${queryString ? `?${queryString}` : ''}`;
  
  return fetchApi<{ materials: Material[]; total: number }>(endpoint);
}

// 获取单个素材详情
export async function getMaterialById(id: number): Promise<Material> {
  return fetchApi<Material>(`/materials/${id}`);
}

// 创建素材
export async function createMaterial(data: CreateMaterialData): Promise<Material> {
  const formData = new FormData();
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('price', data.price.toString());
  formData.append('category', data.category);
  formData.append('tags', JSON.stringify(data.tags));
  formData.append('file', data.file);
  formData.append('thumbnail', data.thumbnail);
  
  return uploadFile<Material>('/materials', formData);
}

// 获取当前用户的素材
export async function getMyMaterials(params?: {
  page?: number;
  limit?: number;
}): Promise<{ materials: Material[]; total: number }> {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
  }
  
  const queryString = queryParams.toString();
  const endpoint = `/materials/author/me${queryString ? `?${queryString}` : ''}`;
  
  return fetchApi<{ materials: Material[]; total: number }>(endpoint);
}

// 更新素材
export async function updateMaterial(id: number, data: UpdateMaterialData): Promise<Material> {
  const formData = new FormData();
  
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      if (key === 'tags') {
        formData.append(key, JSON.stringify(value));
      } else if (key === 'price') {
        formData.append(key, value.toString());
      } else if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    }
  });
  
  return uploadFile<Material>(`/materials/${id}`, formData);
}

// 删除素材
export async function deleteMaterial(id: number): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/materials/${id}`, {
    method: 'DELETE',
  });
}