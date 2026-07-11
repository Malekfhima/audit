import { Report, IReport } from './report.model';
import { GenerateReportDto, ReportFilters } from './report.types';
import { PaginationParams, getPaginationOptions } from '../../core/utils/pagination';

class ReportRepository {
  async create(data: GenerateReportDto): Promise<IReport> {
    const report = await Report.create(data);
    return report;
  }

  async findById(id: string): Promise<IReport | null> {
    return await Report.findById(id).populate('generatedById', 'firstName lastName email');
  }

  async findByReportNumber(reportNumber: string): Promise<IReport | null> {
    return await Report.findOne({ reportNumber: reportNumber.toUpperCase() });
  }

  async update(id: string, data: Partial<IReport>): Promise<IReport | null> {
    return await Report.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('generatedById', 'firstName lastName email');
  }

  async delete(id: string): Promise<boolean> {
    const result = await Report.findByIdAndDelete(id);
    return !!result;
  }

  async findByUser(userId: string, filters: ReportFilters, pagination: PaginationParams): Promise<IReport[]> {
    const { skip, limit, sort } = getPaginationOptions(pagination);
    const query = this.buildQuery(filters);
    query.generatedById = userId;

    return await Report.find(query)
      .populate('generatedById', 'firstName lastName email')
      .skip(skip)
      .limit(limit)
      .sort(sort);
  }

  async find(filters: ReportFilters, pagination: PaginationParams): Promise<IReport[]> {
    const { skip, limit, sort } = getPaginationOptions(pagination);
    const query = this.buildQuery(filters);

    return await Report.find(query)
      .populate('generatedById', 'firstName lastName email')
      .skip(skip)
      .limit(limit)
      .sort(sort);
  }

  async count(filters: ReportFilters): Promise<number> {
    const query = this.buildQuery(filters);
    return await Report.countDocuments(query);
  }

  async markAsCompleted(id: string, filePath: string, fileSize: number): Promise<IReport | null> {
    return await Report.findByIdAndUpdate(
      id,
      { status: 'COMPLETED', filePath, fileSize },
      { new: true }
    );
  }

  async markAsFailed(id: string, error: string): Promise<IReport | null> {
    return await Report.findByIdAndUpdate(
      id,
      { status: 'FAILED', error },
      { new: true }
    );
  }

  async deleteExpired(): Promise<{ deletedCount?: number }> {
    const now = new Date();
    return await Report.deleteMany({ expiresAt: { $lt: now } });
  }

  private buildQuery(filters: ReportFilters): any {
    const query: any = {};

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.generatedById) {
      query.generatedById = filters.generatedById;
    }

    if (filters.startDate || filters.endDate) {
      query.generatedAt = {};
      if (filters.startDate) {
        query.generatedAt.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.generatedAt.$lte = filters.endDate;
      }
    }

    return query;
  }
}

export const reportRepository = new ReportRepository();
