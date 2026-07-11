export type NormStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';

export interface CreateNormDto {
  name: string;
  code: string;
  description?: string;
  version?: string;
  status?: NormStatus;
  category?: string;
  clauses?: NormClause[];
  createdBy?: string;
}

export interface UpdateNormDto {
  name?: string;
  code?: string;
  description?: string;
  version?: string;
  status?: NormStatus;
  category?: string;
  clauses?: NormClause[];
}

export interface NormClause {
  number: string;
  title: string;
  description?: string;
  requirements?: string[];
}

export interface NormResponse {
  id: string;
  name: string;
  code: string;
  description: string;
  version: string;
  status: NormStatus;
  category: string;
  clauses: NormClause[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NormFilters {
  status?: NormStatus;
  category?: string;
  code?: string;
  search?: string;
}
