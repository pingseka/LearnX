import { fetchApi } from './index';
import type { Material } from './materials';

export interface PublicAuthor {
  id: number;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface PublicAuthorProfile {
  author: PublicAuthor;
  materials: Material[];
  materialCount: number;
}

export async function getAuthorProfile(id: number): Promise<PublicAuthorProfile> {
  return fetchApi<PublicAuthorProfile>(`/authors/${id}`);
}
