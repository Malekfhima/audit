import { Risk, IRisk } from './risk.model';
import { CreateRiskDto, UpdateRiskDto, RiskFilters } from './risk.types';
import { PaginationParams, getPaginationOptions } from '../../core/utils/pagination';
import { RiskLink, IRiskLink } from './riskLink.model';

class RiskRepository {
  async create(data: CreateRiskDto): Promise<IRisk> {
    const risk = await Risk.create(data);
    return risk;
  }

  async findById(id: string): Promise<IRisk | null> {
    return await Risk.findById(id)
      .populate('siteId', 'name code')
      .populate('processId', 'name code')
      .populate('ownerId', 'firstName lastName email')
      .populate('identifiedById', 'firstName lastName email');
  }

  async findByRiskNumber(riskNumber: string): Promise<IRisk | null> {
    return await Risk.findOne({ riskNumber: riskNumber.toUpperCase() });
  }

  async update(id: string, data: UpdateRiskDto): Promise<IRisk | null> {
    return await Risk.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('siteId', 'name code')
      .populate('processId', 'name code')
      .populate('ownerId', 'firstName lastName email');
  }

  async delete(id: string): Promise<boolean> {
    const result = await Risk.findByIdAndDelete(id);
    return !!result;
  }

  async find(filters: RiskFilters, pagination: PaginationParams): Promise<IRisk[]> {
    const { skip, limit, sort } = getPaginationOptions(pagination);
    const query = this.buildQuery(filters);

    return await Risk.find(query)
      .populate('siteId', 'name code')
      .populate('processId', 'name code')
      .populate('ownerId', 'firstName lastName email')
      .skip(skip)
      .limit(limit)
      .sort(sort);
  }

  async count(filters: RiskFilters): Promise<number> {
    const query = this.buildQuery(filters);
    return await Risk.countDocuments(query);
  }

  async updateStatus(id: string, status: string): Promise<IRisk | null> {
    return await Risk.findByIdAndUpdate(id, { status }, { new: true });
  }

  async updateMitigation(id: string, mitigationPlan: string, contingencyPlan?: string): Promise<IRisk | null> {
    return await Risk.findByIdAndUpdate(
      id,
      { mitigationPlan, contingencyPlan, status: 'MITIGATING' },
      { new: true }
    );
  }

  async updateResidualRisk(id: string, residualProbability: number, residualImpact: number): Promise<IRisk | null> {
    return await Risk.findByIdAndUpdate(
      id,
      { residualProbability, residualImpact },
      { new: true, runValidators: true }
    );
  }

  async getHighRisks(): Promise<IRisk[]> {
    return await Risk.find({ riskLevel: 'HIGH' })
      .populate('siteId', 'name code')
      .populate('processId', 'name code')
      .populate('ownerId', 'firstName lastName email')
      .sort({ riskScore: -1 });
  }

  async getCriticalRisks(): Promise<IRisk[]> {
    return await Risk.find({ riskLevel: 'CRITICAL' })
      .populate('siteId', 'name code')
      .populate('processId', 'name code')
      .populate('ownerId', 'firstName lastName email')
      .sort({ riskScore: -1 });
  }

  async getRisksByOwner(ownerId: string): Promise<IRisk[]> {
    return await Risk.find({ ownerId })
      .populate('siteId', 'name code')
      .populate('processId', 'name code')
      .sort({ riskScore: -1 });
  }

  async getRisksNeedingReview(): Promise<IRisk[]> {
    const today = new Date();
    return await Risk.find({
      reviewDate: { $lte: today },
      status: { $in: ['MITIGATING', 'MONITORING'] },
    })
      .populate('siteId', 'name code')
      .populate('ownerId', 'firstName lastName email')
      .sort({ reviewDate: 1 });
  }

  async createLink(riskId: string, linkedEntityType: string, linkedEntityId: string, linkType: string, notes?: string): Promise<IRiskLink> {
    const link = await RiskLink.create({
      riskId,
      linkedEntityType,
      linkedEntityId,
      linkType,
      notes,
    });
    return link;
  }

  async deleteLink(linkId: string): Promise<boolean> {
    const result = await RiskLink.findByIdAndDelete(linkId);
    return !!result;
  }

  async findLinksByRisk(riskId: string): Promise<IRiskLink[]> {
    return await RiskLink.find({ riskId }).sort({ createdAt: -1 });
  }

  async findLinksByEntity(linkedEntityType: string, linkedEntityId: string): Promise<IRiskLink[]> {
    return await RiskLink.find({ linkedEntityType, linkedEntityId })
      .populate('riskId', 'riskNumber title riskLevel')
      .sort({ createdAt: -1 });
  }

  private buildQuery(filters: RiskFilters): any {
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.riskLevel) {
      query.riskLevel = filters.riskLevel;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.siteId) {
      query.siteId = filters.siteId;
    }

    if (filters.processId) {
      query.processId = filters.processId;
    }

    if (filters.ownerId) {
      query.ownerId = filters.ownerId;
    }

    if (filters.startDate || filters.endDate) {
      query.identifiedAt = {};
      if (filters.startDate) {
        query.identifiedAt.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.identifiedAt.$lte = filters.endDate;
      }
    }

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { riskNumber: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return query;
  }
}

export const riskRepository = new RiskRepository();
