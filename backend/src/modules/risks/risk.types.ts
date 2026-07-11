import { RiskCategory, RiskLevel, RiskStatus } from './risk.model';

export interface CreateRiskDto {
  title: string;
  description: string;
  category: RiskCategory;
  probability: number;
  impact: number;
  siteId?: string;
  processId?: string;
  ownerId: string;
  identifiedById: string;
  mitigationPlan?: string;
  contingencyPlan?: string;
}

export interface UpdateRiskDto {
  title?: string;
  description?: string;
  category?: RiskCategory;
  probability?: number;
  impact?: number;
  status?: RiskStatus;
  siteId?: string;
  processId?: string;
  ownerId?: string;
  mitigationPlan?: string;
  contingencyPlan?: string;
  residualProbability?: number;
  residualImpact?: number;
  reviewDate?: Date;
}

export interface RiskResponse {
  id: string;
  riskNumber: string;
  title: string;
  description: string;
  category: RiskCategory;
  probability: number;
  impact: number;
  riskScore: number;
  riskLevel: RiskLevel;
  status: RiskStatus;
  siteId?: string;
  processId?: string;
  ownerId: string;
  identifiedById: string;
  identifiedAt: Date;
  mitigationPlan?: string;
  contingencyPlan?: string;
  residualProbability?: number;
  residualImpact?: number;
  residualRiskScore?: number;
  residualRiskLevel?: RiskLevel;
  reviewDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface RiskFilters {
  status?: RiskStatus;
  riskLevel?: RiskLevel;
  category?: RiskCategory;
  siteId?: string;
  processId?: string;
  ownerId?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}
