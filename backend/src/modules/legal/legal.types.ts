import { LegalCategory } from './legalRequirement.model';
import { ComplianceStatus } from './legalCompliance.model';

export interface CreateLegalRequirementDto {
  title: string;
  reference: string;
  description: string;
  category: LegalCategory;
  jurisdiction: string;
  authority: string;
  effectiveDate: Date;
  expiryDate?: Date;
  reviewDate: Date;
  url?: string;
  attachments?: string[];
  applicableSites?: string[];
  responsibleId: string;
}

export interface UpdateLegalRequirementDto {
  title?: string;
  reference?: string;
  description?: string;
  category?: LegalCategory;
  jurisdiction?: string;
  authority?: string;
  effectiveDate?: Date;
  expiryDate?: Date;
  reviewDate?: Date;
  url?: string;
  attachments?: string[];
  applicableSites?: string[];
  responsibleId?: string;
  isActive?: boolean;
}

export interface LegalRequirementResponse {
  id: string;
  requirementNumber: string;
  title: string;
  reference: string;
  description: string;
  category: LegalCategory;
  jurisdiction: string;
  authority: string;
  effectiveDate: Date;
  expiryDate?: Date;
  reviewDate: Date;
  url?: string;
  attachments?: string[];
  applicableSites?: string[];
  responsibleId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateComplianceDto {
  legalRequirementId: string;
  siteId: string;
  complianceStatus: ComplianceStatus;
  assessedById: string;
  evidence?: string;
  evidenceAttachments?: string[];
  gaps?: string;
  actionPlanId?: string;
  nextReviewDate: Date;
}

export interface UpdateComplianceDto {
  complianceStatus?: ComplianceStatus;
  evidence?: string;
  evidenceAttachments?: string[];
  gaps?: string;
  actionPlanId?: string;
  nextReviewDate?: Date;
}

export interface ComplianceResponse {
  id: string;
  legalRequirementId: string;
  siteId: string;
  complianceStatus: ComplianceStatus;
  assessmentDate: Date;
  assessedById: string;
  evidence?: string;
  evidenceAttachments?: string[];
  gaps?: string;
  actionPlanId?: string;
  nextReviewDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface LegalRequirementFilters {
  category?: LegalCategory;
  jurisdiction?: string;
  isActive?: boolean;
  responsibleId?: string;
  siteId?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}

export interface ComplianceFilters {
  complianceStatus?: ComplianceStatus;
  legalRequirementId?: string;
  siteId?: string;
  assessedById?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}
