import { ReportType, ReportFormat, ReportStatus } from './report.model';

export interface GenerateReportDto {
  name: string;
  type: ReportType;
  format: ReportFormat;
  filters: Record<string, any>;
  expiresAt?: Date;
  generatedById?: string;
}

export interface ReportResponse {
  id: string;
  reportNumber: string;
  name: string;
  type: ReportType;
  format: ReportFormat;
  filters: Record<string, any>;
  status: ReportStatus;
  filePath?: string;
  fileSize?: number;
  generatedById: string;
  generatedAt: Date;
  expiresAt?: Date;
  error?: string;
  createdAt: Date;
}

export interface ReportFilters {
  type?: ReportType;
  status?: ReportStatus;
  generatedById?: string;
  startDate?: Date;
  endDate?: Date;
}
