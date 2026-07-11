import { reportRepository } from './report.repository';
import { GenerateReportDto, ReportFilters } from './report.types';
import { NotFoundError } from '../../core/http/httpError';
import { PaginationParams, createPaginationResult } from '../../core/utils/pagination';
import { IReport } from './report.model';
import { User } from '../users/user.model';

class ReportService {
  async generateReport(dto: GenerateReportDto, userId: string): Promise<IReport> {
    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const report = await reportRepository.create({
      name: dto.name,
      type: dto.type,
      format: dto.format,
      filters: dto.filters,
      expiresAt: dto.expiresAt,
      generatedById: userId,
    });

    return report;
  }

  async getReport(id: string): Promise<IReport> {
    const report = await reportRepository.findById(id);
    if (!report) throw new NotFoundError('Report not found');
    return report;
  }

  async deleteReport(id: string): Promise<void> {
    const report = await reportRepository.findById(id);
    if (!report) throw new NotFoundError('Report not found');

    await reportRepository.delete(id);
  }

  async getUserReports(userId: string, filters: ReportFilters, pagination: PaginationParams) {
    const reports = await reportRepository.findByUser(userId, filters, pagination);
    const total = await reportRepository.count({ ...filters, generatedById: userId });
    return createPaginationResult(reports, total, pagination);
  }

  async getAllReports(filters: ReportFilters, pagination: PaginationParams) {
    const reports = await reportRepository.find(filters, pagination);
    const total = await reportRepository.count(filters);
    return createPaginationResult(reports, total, pagination);
  }

  async markAsCompleted(id: string, filePath: string, fileSize: number): Promise<IReport> {
    const report = await reportRepository.findById(id);
    if (!report) throw new NotFoundError('Report not found');

    const updated = await reportRepository.markAsCompleted(id, filePath, fileSize);
    if (!updated) throw new NotFoundError('Report not found');
    return updated;
  }

  async markAsFailed(id: string, error: string): Promise<IReport> {
    const report = await reportRepository.findById(id);
    if (!report) throw new NotFoundError('Report not found');

    const updated = await reportRepository.markAsFailed(id, error);
    if (!updated) throw new NotFoundError('Report not found');
    return updated;
  }

  async deleteExpiredReports() {
    return await reportRepository.deleteExpired();
  }

  async generateAuditSummaryReport(filters: any): Promise<any> {
    return { type: 'AUDIT_SUMMARY', data: [], filters };
  }

  async generateNCStatusReport(filters: any): Promise<any> {
    return { type: 'NC_REPORT', data: [], filters };
  }

  async generateCorrectiveActionsReport(filters: any): Promise<any> {
    return { type: 'ACTION_TRACKING', data: [], filters };
  }

  async generateComplianceReport(filters: any): Promise<any> {
    return { type: 'COMPLIANCE_REPORT', data: [], filters };
  }

  async generateRiskMatrixReport(filters: any): Promise<any> {
    return { type: 'RISK_REGISTER', data: [], filters };
  }

  async generateSitePerformanceReport(filters: any): Promise<any> {
    return { type: 'SITE_PERFORMANCE', data: [], filters };
  }

  async generateUserActivityReport(filters: any): Promise<any> {
    return { type: 'USER_ACTIVITY', data: [], filters };
  }

  async exportToPDF(data: any, template?: string): Promise<string> {
    return 'path/to/report.pdf';
  }

  async exportToExcel(data: any): Promise<string> {
    return 'path/to/report.xlsx';
  }

  async exportToCSV(data: any): Promise<string> {
    return 'path/to/report.csv';
  }
}

export const reportService = new ReportService();
