import { LegalRequirement, ILegalRequirement } from './legalRequirement.model';
import { LegalCompliance, ILegalCompliance } from './legalCompliance.model';
import { CreateLegalRequirementDto, UpdateLegalRequirementDto, LegalRequirementFilters } from './legal.types';
import { CreateComplianceDto, UpdateComplianceDto, ComplianceFilters } from './legal.types';
import { PaginationParams, getPaginationOptions } from '../../core/utils/pagination';

class LegalRepository {
  async createRequirement(data: CreateLegalRequirementDto): Promise<ILegalRequirement> {
    const requirement = await LegalRequirement.create(data);
    return requirement;
  }

  async findRequirementById(id: string): Promise<ILegalRequirement | null> {
    return await LegalRequirement.findById(id)
      .populate('applicableSites', 'name code')
      .populate('responsibleId', 'firstName lastName email');
  }

  async findByRequirementNumber(requirementNumber: string): Promise<ILegalRequirement | null> {
    return await LegalRequirement.findOne({ requirementNumber: requirementNumber.toUpperCase() });
  }

  async updateRequirement(id: string, data: UpdateLegalRequirementDto): Promise<ILegalRequirement | null> {
    return await LegalRequirement.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('applicableSites', 'name code')
      .populate('responsibleId', 'firstName lastName email');
  }

  async deleteRequirement(id: string): Promise<boolean> {
    const result = await LegalRequirement.findByIdAndDelete(id);
    return !!result;
  }

  async findRequirements(filters: LegalRequirementFilters, pagination: PaginationParams): Promise<ILegalRequirement[]> {
    const { skip, limit, sort } = getPaginationOptions(pagination);
    const query = this.buildRequirementQuery(filters);

    return await LegalRequirement.find(query)
      .populate('applicableSites', 'name code')
      .populate('responsibleId', 'firstName lastName email')
      .skip(skip)
      .limit(limit)
      .sort(sort);
  }

  async countRequirements(filters: LegalRequirementFilters): Promise<number> {
    const query = this.buildRequirementQuery(filters);
    return await LegalRequirement.countDocuments(query);
  }

  async createCompliance(data: CreateComplianceDto): Promise<ILegalCompliance> {
    const compliance = await LegalCompliance.create(data);
    return compliance;
  }

  async findComplianceById(id: string): Promise<ILegalCompliance | null> {
    return await LegalCompliance.findById(id)
      .populate('legalRequirementId', 'requirementNumber title reference')
      .populate('siteId', 'name code')
      .populate('assessedById', 'firstName lastName email')
      .populate('actionPlanId', 'actionNumber description');
  }

  async updateCompliance(id: string, data: UpdateComplianceDto): Promise<ILegalCompliance | null> {
    return await LegalCompliance.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('legalRequirementId', 'requirementNumber title reference')
      .populate('siteId', 'name code');
  }

  async deleteCompliance(id: string): Promise<boolean> {
    const result = await LegalCompliance.findByIdAndDelete(id);
    return !!result;
  }

  async findCompliances(filters: ComplianceFilters, pagination: PaginationParams): Promise<ILegalCompliance[]> {
    const { skip, limit, sort } = getPaginationOptions(pagination);
    const query = this.buildComplianceQuery(filters);

    return await LegalCompliance.find(query)
      .populate('legalRequirementId', 'requirementNumber title reference')
      .populate('siteId', 'name code')
      .populate('assessedById', 'firstName lastName email')
      .skip(skip)
      .limit(limit)
      .sort(sort);
  }

  async countCompliances(filters: ComplianceFilters): Promise<number> {
    const query = this.buildComplianceQuery(filters);
    return await LegalCompliance.countDocuments(query);
  }

  async getComplianceBySite(siteId: string): Promise<ILegalCompliance[]> {
    return await LegalCompliance.find({ siteId })
      .populate('legalRequirementId', 'requirementNumber title reference category')
      .populate('assessedById', 'firstName lastName email')
      .sort({ nextReviewDate: 1 });
  }

  async getComplianceByRequirement(requirementId: string): Promise<ILegalCompliance[]> {
    return await LegalCompliance.find({ legalRequirementId: requirementId })
      .populate('siteId', 'name code')
      .populate('assessedById', 'firstName lastName email')
      .sort({ assessmentDate: -1 });
  }

  async getNonCompliantRecords(): Promise<ILegalCompliance[]> {
    return await LegalCompliance.find({
      complianceStatus: { $in: ['NON_COMPLIANT', 'PARTIALLY_COMPLIANT'] },
    })
      .populate('legalRequirementId', 'requirementNumber title reference')
      .populate('siteId', 'name code')
      .populate('assessedById', 'firstName lastName email')
      .sort({ assessmentDate: -1 });
  }

  async getCompliancesNeedingReview(): Promise<ILegalCompliance[]> {
    const today = new Date();
    return await LegalCompliance.find({
      nextReviewDate: { $lte: today },
    })
      .populate('legalRequirementId', 'requirementNumber title reference')
      .populate('siteId', 'name code')
      .sort({ nextReviewDate: 1 });
  }

  private buildRequirementQuery(filters: LegalRequirementFilters): any {
    const query: any = {};

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.jurisdiction) {
      query.jurisdiction = filters.jurisdiction;
    }

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters.responsibleId) {
      query.responsibleId = filters.responsibleId;
    }

    if (filters.siteId) {
      query.applicableSites = filters.siteId;
    }

    if (filters.startDate || filters.endDate) {
      query.effectiveDate = {};
      if (filters.startDate) {
        query.effectiveDate.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.effectiveDate.$lte = filters.endDate;
      }
    }

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
        { reference: { $regex: filters.search, $options: 'i' } },
        { requirementNumber: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return query;
  }

  private buildComplianceQuery(filters: ComplianceFilters): any {
    const query: any = {};

    if (filters.complianceStatus) {
      query.complianceStatus = filters.complianceStatus;
    }

    if (filters.legalRequirementId) {
      query.legalRequirementId = filters.legalRequirementId;
    }

    if (filters.siteId) {
      query.siteId = filters.siteId;
    }

    if (filters.assessedById) {
      query.assessedById = filters.assessedById;
    }

    if (filters.startDate || filters.endDate) {
      query.assessmentDate = {};
      if (filters.startDate) {
        query.assessmentDate.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.assessmentDate.$lte = filters.endDate;
      }
    }

    if (filters.search) {
      query.$or = [
        { evidence: { $regex: filters.search, $options: 'i' } },
        { gaps: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return query;
  }
}

export const legalRepository = new LegalRepository();
