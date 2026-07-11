import { legalRepository } from './legal.repository';
import { CreateLegalRequirementDto, UpdateLegalRequirementDto, LegalRequirementFilters } from './legal.types';
import { CreateComplianceDto, UpdateComplianceDto, ComplianceFilters } from './legal.types';
import { NotFoundError, BadRequestError } from '../../core/http/httpError';
import { PaginationParams, createPaginationResult } from '../../core/utils/pagination';
import { ILegalRequirement, LegalRequirement } from './legalRequirement.model';
import { ILegalCompliance } from './legalCompliance.model';
import { Site } from '../sites/site.model';
import { User } from '../users/user.model';

class LegalService {
  async createRequirement(dto: CreateLegalRequirementDto): Promise<ILegalRequirement> {
    const user = await User.findById(dto.responsibleId);
    if (!user) throw new NotFoundError('Responsible user not found');

    if (dto.applicableSites && dto.applicableSites.length > 0) {
      const sites = await Site.find({ _id: { $in: dto.applicableSites } });
      if (sites.length !== dto.applicableSites.length) {
        throw new NotFoundError('One or more sites not found');
      }
    }

    const requirement = await legalRepository.createRequirement(dto);
    return requirement;
  }

  async getRequirement(id: string): Promise<ILegalRequirement> {
    const requirement = await legalRepository.findRequirementById(id);
    if (!requirement) throw new NotFoundError('Legal requirement not found');
    return requirement;
  }

  async updateRequirement(id: string, dto: UpdateLegalRequirementDto): Promise<ILegalRequirement> {
    const requirement = await legalRepository.findRequirementById(id);
    if (!requirement) throw new NotFoundError('Legal requirement not found');

    if (dto.responsibleId) {
      const user = await User.findById(dto.responsibleId);
      if (!user) throw new NotFoundError('Responsible user not found');
    }

    if (dto.applicableSites && dto.applicableSites.length > 0) {
      const sites = await Site.find({ _id: { $in: dto.applicableSites } });
      if (sites.length !== dto.applicableSites.length) {
        throw new NotFoundError('One or more sites not found');
      }
    }

    const updated = await legalRepository.updateRequirement(id, dto);
    if (!updated) throw new NotFoundError('Legal requirement not found');
    return updated;
  }

  async deleteRequirement(id: string): Promise<void> {
    const requirement = await legalRepository.findRequirementById(id);
    if (!requirement) throw new NotFoundError('Legal requirement not found');

    await legalRepository.deleteRequirement(id);
  }

  async getAllRequirements(filters: LegalRequirementFilters, pagination: PaginationParams) {
    const requirements = await legalRepository.findRequirements(filters, pagination);
    const total = await legalRepository.countRequirements(filters);
    return createPaginationResult(requirements, total, pagination);
  }

  async assignToSites(id: string, siteIds: string[]): Promise<ILegalRequirement> {
    const requirement = await legalRepository.findRequirementById(id);
    if (!requirement) throw new NotFoundError('Legal requirement not found');

    const sites = await Site.find({ _id: { $in: siteIds } });
    if (sites.length !== siteIds.length) {
      throw new NotFoundError('One or more sites not found');
    }

    const updated = await legalRepository.updateRequirement(id, { applicableSites: siteIds });
    if (!updated) throw new NotFoundError('Legal requirement not found');
    return updated;
  }

  async assignResponsible(id: string, userId: string): Promise<ILegalRequirement> {
    const requirement = await legalRepository.findRequirementById(id);
    if (!requirement) throw new NotFoundError('Legal requirement not found');

    const user = await User.findById(userId);
    if (!user) throw new NotFoundError('User not found');

    const updated = await legalRepository.updateRequirement(id, { responsibleId: userId });
    if (!updated) throw new NotFoundError('Legal requirement not found');
    return updated;
  }

  async getRequirementsBySite(siteId: string): Promise<ILegalRequirement[]> {
    const site = await Site.findById(siteId);
    if (!site) throw new NotFoundError('Site not found');

    const requirements = await LegalRequirement.find({
      $or: [
        { applicableSites: { $size: 0 } },
        { applicableSites: siteId },
      ],
      isActive: true,
    })
      .populate('responsibleId', 'firstName lastName email')
      .sort({ reviewDate: 1 });
    return requirements;
  }

  async getUpcomingReviews(): Promise<ILegalRequirement[]> {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    return await LegalRequirement.find({
      isActive: true,
      reviewDate: { $gte: today, $lte: thirtyDaysFromNow },
    })
      .populate('applicableSites', 'name code')
      .populate('responsibleId', 'firstName lastName email')
      .sort({ reviewDate: 1 });
  }

  async assessCompliance(requirementId: string, siteId: string, dto: CreateComplianceDto): Promise<ILegalCompliance> {
    const requirement = await legalRepository.findRequirementById(requirementId);
    if (!requirement) throw new NotFoundError('Legal requirement not found');

    const site = await Site.findById(siteId);
    if (!site) throw new NotFoundError('Site not found');

    const user = await User.findById(dto.assessedById);
    if (!user) throw new NotFoundError('Assessor user not found');

    const compliance = await legalRepository.createCompliance({
      ...dto,
      legalRequirementId: requirementId,
      siteId,
    });
    return compliance;
  }

  async getCompliance(id: string): Promise<ILegalCompliance> {
    const compliance = await legalRepository.findComplianceById(id);
    if (!compliance) throw new NotFoundError('Compliance record not found');
    return compliance;
  }

  async updateComplianceStatus(id: string, dto: UpdateComplianceDto): Promise<ILegalCompliance> {
    const compliance = await legalRepository.findComplianceById(id);
    if (!compliance) throw new NotFoundError('Compliance record not found');

    const updated = await legalRepository.updateCompliance(id, dto);
    if (!updated) throw new NotFoundError('Compliance record not found');
    return updated;
  }

  async getComplianceReport(siteId: string): Promise<ILegalCompliance[]> {
    const site = await Site.findById(siteId);
    if (!site) throw new NotFoundError('Site not found');

    return await legalRepository.getComplianceBySite(siteId);
  }

  async getNonCompliantRequirements(): Promise<ILegalCompliance[]> {
    return await legalRepository.getNonCompliantRecords();
  }

  async getCompliancesNeedingReview(): Promise<ILegalCompliance[]> {
    return await legalRepository.getCompliancesNeedingReview();
  }

  async getAllCompliances(filters: ComplianceFilters, pagination: PaginationParams) {
    const compliances = await legalRepository.findCompliances(filters, pagination);
    const total = await legalRepository.countCompliances(filters);
    return createPaginationResult(compliances, total, pagination);
  }

  async linkActionPlan(complianceId: string, actionPlanId: string): Promise<ILegalCompliance> {
    const compliance = await legalRepository.findComplianceById(complianceId);
    if (!compliance) throw new NotFoundError('Compliance record not found');

    const updated = await legalRepository.updateCompliance(complianceId, { actionPlanId });
    if (!updated) throw new NotFoundError('Compliance record not found');
    return updated;
  }

  async getComplianceStatistics() {
    const compliant = await legalRepository.countCompliances({ complianceStatus: 'COMPLIANT' as any });
    const nonCompliant = await legalRepository.countCompliances({ complianceStatus: 'NON_COMPLIANT' as any });
    const partiallyCompliant = await legalRepository.countCompliances({ complianceStatus: 'PARTIALLY_COMPLIANT' as any });
    const pending = await legalRepository.countCompliances({ complianceStatus: 'PENDING_ASSESSMENT' as any });
    const notApplicable = await legalRepository.countCompliances({ complianceStatus: 'NOT_APPLICABLE' as any });

    return {
      byStatus: { compliant, nonCompliant, partiallyCompliant, pending, notApplicable },
      total: compliant + nonCompliant + partiallyCompliant + pending + notApplicable,
    };
  }
}

export const legalService = new LegalService();
