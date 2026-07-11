import { NonConformity, INonConformity } from './nonConformity.model';
import { CreateNonConformityDto, UpdateNonConformityDto, NonConformityFilters } from './nonConformity.types';
import { PaginationParams, getPaginationOptions } from '../../core/utils/pagination';

class NonConformityRepository {
  async create(data: CreateNonConformityDto): Promise<INonConformity> {
    const nc = await NonConformity.create(data);
    return nc;
  }

  async findById(id: string): Promise<INonConformity | null> {
    return await NonConformity.findById(id)
      .populate('auditId')
      .populate('auditEntryId')
      .populate('clauseId')
      .populate('detectedById', 'firstName lastName email')
      .populate('assignedToId', 'firstName lastName email')
      .populate('siteId', 'name code')
      .populate('processId', 'name code')
      .populate('verifiedById', 'firstName lastName email');
  }

  async findByNCNumber(ncNumber: string): Promise<INonConformity | null> {
    return await NonConformity.findOne({ ncNumber: ncNumber.toUpperCase() });
  }

  async update(id: string, data: UpdateNonConformityDto): Promise<INonConformity | null> {
    return await NonConformity.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('auditId')
      .populate('auditEntryId')
      .populate('detectedById', 'firstName lastName email')
      .populate('assignedToId', 'firstName lastName email');
  }

  async delete(id: string): Promise<boolean> {
    const result = await NonConformity.findByIdAndDelete(id);
    return !!result;
  }

  async find(filters: NonConformityFilters, pagination: PaginationParams): Promise<INonConformity[]> {
    const { skip, limit, sort } = getPaginationOptions(pagination);
    const query = this.buildQuery(filters);

    return await NonConformity.find(query)
      .populate('auditId', 'title auditNumber')
      .populate('detectedById', 'firstName lastName email')
      .populate('assignedToId', 'firstName lastName email')
      .skip(skip)
      .limit(limit)
      .sort(sort);
  }

  async count(filters: NonConformityFilters): Promise<number> {
    const query = this.buildQuery(filters);
    return await NonConformity.countDocuments(query);
  }

  async updateStatus(id: string, status: string): Promise<INonConformity | null> {
    return await NonConformity.findByIdAndUpdate(id, { status }, { new: true });
  }

  async assignTo(id: string, assignedToId: string): Promise<INonConformity | null> {
    return await NonConformity.findByIdAndUpdate(id, { assignedToId }, { new: true });
  }

  async addRootCause(id: string, rootCause: string): Promise<INonConformity | null> {
    return await NonConformity.findByIdAndUpdate(id, { rootCause }, { new: true });
  }

  async addImmediateAction(id: string, immediateAction: string): Promise<INonConformity | null> {
    return await NonConformity.findByIdAndUpdate(id, { immediateAction }, { new: true });
  }

  async markAsVerified(id: string, verifiedById: string): Promise<INonConformity | null> {
    return await NonConformity.findByIdAndUpdate(
      id,
      { verifiedById, verifiedAt: new Date(), status: 'CLOSED' },
      { new: true }
    );
  }

  async getNCsByAudit(auditId: string): Promise<INonConformity[]> {
    return await NonConformity.find({ auditId })
      .populate('detectedById', 'firstName lastName email')
      .populate('assignedToId', 'firstName lastName email');
  }

  async getNCsByAssignedTo(assignedToId: string): Promise<INonConformity[]> {
    return await NonConformity.find({ assignedToId })
      .populate('auditId', 'title auditNumber')
      .populate('detectedById', 'firstName lastName email');
  }

  async getOpenNCs(): Promise<INonConformity[]> {
    return await NonConformity.find({ status: 'OPEN' })
      .populate('auditId', 'title auditNumber')
      .populate('assignedToId', 'firstName lastName email')
      .sort({ detectedAt: -1 });
  }

  private buildQuery(filters: NonConformityFilters): any {
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.severity) {
      query.severity = filters.severity;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.auditId) {
      query.auditId = filters.auditId;
    }

    if (filters.assignedToId) {
      query.assignedToId = filters.assignedToId;
    }

    if (filters.siteId) {
      query.siteId = filters.siteId;
    }

    if (filters.startDate || filters.endDate) {
      query.detectedAt = {};
      if (filters.startDate) {
        query.detectedAt.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.detectedAt.$lte = filters.endDate;
      }
    }

    if (filters.search) {
      query.$or = [
        { description: { $regex: filters.search, $options: 'i' } },
        { ncNumber: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return query;
  }
}

export const nonConformityRepository = new NonConformityRepository();
