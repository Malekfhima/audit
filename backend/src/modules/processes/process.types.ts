export type ProcessCategory = 'PRODUCTION' | 'QUALITY' | 'MAINTENANCE' | 'LOGISTICS' | 'ADMINISTRATION' | 'OTHER';

export interface CreateProcessDto {
  name: string;
  code: string;
  description?: string;
  siteId: string;
  processOwnerId?: string;
  category?: ProcessCategory;
}

export interface UpdateProcessDto {
  name?: string;
  code?: string;
  description?: string;
  processOwnerId?: string;
  category?: ProcessCategory;
  isActive?: boolean;
}

export interface ProcessResponse {
  id: string;
  name: string;
  code: string;
  description: string;
  siteId: string;
  processOwnerId: string;
  category: ProcessCategory;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProcessFilters {
  siteId?: string;
  category?: ProcessCategory;
  isActive?: boolean;
  search?: string;
}
