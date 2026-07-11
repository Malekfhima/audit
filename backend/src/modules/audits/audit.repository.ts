import { Audit, IAudit } from './audit.model';
import { CreateAuditDto, UpdateAuditDto, AuditFilters } from './audit.types';
import { PaginationParams, getPaginationOptions } from '../../core/utils/pagination';

class AuditRepository {
  async create(data: CreateAuditDto): Promise<IAudit> {
    const audit = await Audit.create(data);
    return audit;
  }

  async findById(id: string): Promise<IAudit | null> {
    return await Audit.findById(id)
      .populate('normId', 'name code')
      .populate('siteId', 'name code')
      .populate('processIds', 'name code')
      .populate('leadAuditorId', 'firstName lastName email')
      .populate('auditorIds', 'firstName lastName email')
      .populate('auditeeIds', 'firstName lastName email')
      .populate('createdBy', 'firstName lastName email');
  }

  async findByAuditNumber(auditNumber: string): Promise<IAudit | null> {
    return await Audit.findOne({ auditNumber: auditNumber.toUpperCase() });
  }

  async update(id: string, data: UpdateAuditDto): Promise<IAudit | null> {
    return await Audit.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('normId', 'name code')
      .populate('siteId', 'name code')
      .populate('processIds', 'name code')
      .populate('leadAuditorId', 'firstName lastName email')
      .populate('auditorIds', 'firstName lastName email')
      .populate('auditeeIds', 'firstName lastName email');
  }

  async delete(id: string): Promise<boolean> {
    const result = await Audit.findByIdAndDelete(id);
    return !!result;
  }

  async updateStatus(id: string, status: string): Promise<IAudit | null> {
    return await Audit.findByIdAndUpdate(id, { status }, { new: true });
  }

  async updateConformityScore(id: string, score: number): Promise<IAudit | null> {
    return await Audit.findByIdAndUpdate(id, { conformityScore: score }, { new: true });
  }

  async find(filters: AuditFilters, pagination: PaginationParams): Promise<IAudit[]> {
    const { skip, limit, sort } = getPaginationOptions(pagination);
    const query = this.buildQuery(filters);

    return await Audit.find(query)
      .populate('normId', 'name code')
      .populate('siteId', 'name code')
      .populate('leadAuditorId', 'firstName lastName email')
      .populate('auditorIds', 'firstName lastName email')
      .skip(skip)
      .limit(limit)
      .sort(sort);
  }

  async count(filters: AuditFilters): Promise<number> {
    const query = this.buildQuery(filters);
    return await Audit.countDocuments(query);
  }

  async getAuditsBySite(siteId: string): Promise<IAudit[]> {
    return await Audit.find({ siteId })
      .populate('normId', 'name code')
      .populate('siteId', 'name code')
      .populate('leadAuditorId', 'firstName lastName email');
  }

  async getAuditsByNorm(normId: string): Promise<IAudit[]> {
    return await Audit.find({ normId })
      .populate('normId', 'name code')
      .populate('siteId', 'name code')
      .populate('leadAuditorId', 'firstName lastName email');
  }

  async getAuditsByAuditor(auditorId: string): Promise<IAudit[]> {
    return await Audit.find({ $or: [{ leadAuditorId: auditorId }, { auditorIds: auditorId }] })
      .populate('normId', 'name code')
      .populate('siteId', 'name code')
      .populate('leadAuditorId', 'firstName lastName email');
  }

  async getUpcomingAudits(): Promise<IAudit[]> {
    return await Audit.find({ status: 'PLANNED', plannedStartDate: { $gte: new Date() } })
      .populate('normId', 'name code')
      .populate('siteId', 'name code')
      .populate('leadAuditorId', 'firstName lastName email')
      .sort({ plannedStartDate: 1 });
  }

  async getActiveAudits(): Promise<IAudit[]> {
    return await Audit.find({ status: 'IN_PROGRESS' })
      .populate('normId', 'name code')
      .populate('siteId', 'name code')
      .populate('leadAuditorId', 'firstName lastName email')
      .sort({ actualStartDate: -1 });
  }

  async getCompletedAudits(): Promise<IAudit[]> {
    return await Audit.find({ status: 'COMPLETED' })
      .populate('normId', 'name code')
      .populate('siteId', 'name code')
      .populate('leadAuditorId', 'firstName lastName email')
      .sort({ actualEndDate: -1 });
  }

  private buildQuery(filters: AuditFilters): any {
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.siteId) {
      query.siteId = filters.siteId;
    }

    if (filters.normId) {
      query.normId = filters.normId;
    }

    if (filters.leadAuditorId) {
      query.leadAuditorId = filters.leadAuditorId;
    }

    if (filters.auditorId) {
      query.$or = [{ leadAuditorId: filters.auditorId }, { auditorIds: filters.auditorId }];
    }

    if (filters.startDate || filters.endDate) {
      query.plannedStartDate = {};
      if (filters.startDate) {
        query.plannedStartDate.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.plannedStartDate.$lte = filters.endDate;
      }
    }

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { auditNumber: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return query;
  }
}

export const auditRepository = new AuditRepository();
