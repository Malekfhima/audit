import { NCSeverity, NCCategory, NCStatus } from './nonConformity.model';

export interface CreateNonConformityDto {
  auditId: string;
  auditEntryId?: string;
  clauseId?: string;
  description: string;
  rootCause?: string;
  immediateAction?: string;
  severity: NCSeverity;
  category: NCCategory;
  detectedById: string;
  assignedToId?: string;
  siteId?: string;
  processId?: string;
  targetClosureDate?: Date;
}

export interface UpdateNonConformityDto {
  description?: string;
  rootCause?: string;
  immediateAction?: string;
  severity?: NCSeverity;
  category?: NCCategory;
  status?: NCStatus;
  assignedToId?: string;
  siteId?: string;
  processId?: string;
  targetClosureDate?: Date;
  actualClosureDate?: Date;
  verifiedById?: string;
  verifiedAt?: Date;
}

export interface NonConformityResponse {
  id: string;
  ncNumber: string;
  auditId: string;
  auditEntryId?: string;
  clauseId?: string;
  description: string;
  rootCause?: string;
  immediateAction?: string;
  severity: NCSeverity;
  category: NCCategory;
  status: NCStatus;
  detectedById: string;
  detectedAt: Date;
  assignedToId?: string;
  siteId?: string;
  processId?: string;
  targetClosureDate?: Date;
  actualClosureDate?: Date;
  verifiedById?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface NonConformityFilters {
  status?: NCStatus;
  severity?: NCSeverity;
  category?: NCCategory;
  auditId?: string;
  assignedToId?: string;
  siteId?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}
