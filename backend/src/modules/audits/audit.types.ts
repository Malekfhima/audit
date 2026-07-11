export type AuditStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type AuditType = 'INTERNAL' | 'EXTERNAL' | 'CERTIFICATION' | 'SURVEILLANCE' | 'FOLLOW_UP';

export interface CreateAuditDto {
  title: string;
  type: AuditType;
  normId: string;
  siteId: string;
  processIds?: string[];
  leadAuditorId: string;
  auditorIds?: string[];
  auditeeIds?: string[];
  plannedStartDate: Date;
  plannedEndDate: Date;
  scope?: string;
  objectives?: string;
  createdBy?: string;
}

export interface UpdateAuditDto {
  title?: string;
  type?: AuditType;
  normId?: string;
  siteId?: string;
  processIds?: string[];
  leadAuditorId?: string;
  auditorIds?: string[];
  auditeeIds?: string[];
  plannedStartDate?: Date;
  plannedEndDate?: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  scope?: string;
  objectives?: string;
  status?: AuditStatus;
  summary?: string;
  conclusions?: string;
  recommendations?: string;
}

export interface AuditResponse {
  id: string;
  title: string;
  auditNumber: string;
  type: AuditType;
  status: AuditStatus;
  normId: string;
  siteId: string;
  processIds: string[];
  leadAuditorId: string;
  auditorIds: string[];
  auditeeIds: string[];
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  scope: string;
  objectives: string;
  conformityScore: number;
  summary: string;
  conclusions: string;
  recommendations: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditFilters {
  status?: AuditStatus;
  type?: AuditType;
  siteId?: string;
  normId?: string;
  leadAuditorId?: string;
  auditorId?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}
