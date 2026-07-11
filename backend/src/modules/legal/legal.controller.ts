import { Request, Response } from 'express';
import asyncHandler from '../../core/http/asyncHandler';
import { legalService } from './legal.service';
import { parsePaginationParams } from '../../core/utils/pagination';
import { CreateLegalRequirementDto, UpdateLegalRequirementDto } from './legal.types';
import { CreateComplianceDto, UpdateComplianceDto } from './legal.types';

export const createRequirement = asyncHandler(async (req: Request, res: Response) => {
  const dto: CreateLegalRequirementDto = req.body;
  const requirement = await legalService.createRequirement(dto);
  res.status(201).json({ success: true, data: requirement });
});

export const getRequirement = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const requirement = await legalService.getRequirement(id);
  res.json({ success: true, data: requirement });
});

export const updateRequirement = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const dto: UpdateLegalRequirementDto = req.body;
  const requirement = await legalService.updateRequirement(id, dto);
  res.json({ success: true, data: requirement });
});

export const deleteRequirement = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await legalService.deleteRequirement(id);
  res.json({ success: true, message: 'Legal requirement deleted successfully' });
});

export const getAllRequirements = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePaginationParams(req.query);
  const filters: any = {};

  if (req.query.category) filters.category = req.query.category;
  if (req.query.jurisdiction) filters.jurisdiction = req.query.jurisdiction;
  if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';
  if (req.query.responsibleId) filters.responsibleId = req.query.responsibleId;
  if (req.query.siteId) filters.siteId = req.query.siteId;
  if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
  if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);
  if (req.query.search) filters.search = req.query.search;

  const result = await legalService.getAllRequirements(filters, pagination);
  res.json({ success: true, ...result });
});

export const assignToSites = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { siteIds } = req.body;
  const requirement = await legalService.assignToSites(id, siteIds);
  res.json({ success: true, data: requirement });
});

export const assignResponsible = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId } = req.body;
  const requirement = await legalService.assignResponsible(id, userId);
  res.json({ success: true, data: requirement });
});

export const getRequirementsBySite = asyncHandler(async (req: Request, res: Response) => {
  const { siteId } = req.params;
  const requirements = await legalService.getRequirementsBySite(siteId);
  res.json({ success: true, data: requirements });
});

export const getUpcomingReviews = asyncHandler(async (req: Request, res: Response) => {
  const requirements = await legalService.getUpcomingReviews();
  res.json({ success: true, data: requirements });
});

export const assessCompliance = asyncHandler(async (req: Request, res: Response) => {
  const { requirementId, siteId } = req.params;
  const dto: CreateComplianceDto = req.body;
  const compliance = await legalService.assessCompliance(requirementId, siteId, dto);
  res.status(201).json({ success: true, data: compliance });
});

export const getCompliance = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const compliance = await legalService.getCompliance(id);
  res.json({ success: true, data: compliance });
});

export const updateComplianceStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const dto: UpdateComplianceDto = req.body;
  const compliance = await legalService.updateComplianceStatus(id, dto);
  res.json({ success: true, data: compliance });
});

export const getComplianceReport = asyncHandler(async (req: Request, res: Response) => {
  const { siteId } = req.params;
  const compliances = await legalService.getComplianceReport(siteId);
  res.json({ success: true, data: compliances });
});

export const getNonCompliantRequirements = asyncHandler(async (req: Request, res: Response) => {
  const compliances = await legalService.getNonCompliantRequirements();
  res.json({ success: true, data: compliances });
});

export const getAllCompliances = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePaginationParams(req.query);
  const filters: any = {};

  if (req.query.complianceStatus) filters.complianceStatus = req.query.complianceStatus;
  if (req.query.legalRequirementId) filters.legalRequirementId = req.query.legalRequirementId;
  if (req.query.siteId) filters.siteId = req.query.siteId;
  if (req.query.assessedById) filters.assessedById = req.query.assessedById;
  if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
  if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);
  if (req.query.search) filters.search = req.query.search;

  const result = await legalService.getAllCompliances(filters, pagination);
  res.json({ success: true, ...result });
});

export const getCompliancesNeedingReview = asyncHandler(async (req: Request, res: Response) => {
  const compliances = await legalService.getCompliancesNeedingReview();
  res.json({ success: true, data: compliances });
});

export const linkActionPlan = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { actionPlanId } = req.body;
  const compliance = await legalService.linkActionPlan(id, actionPlanId);
  res.json({ success: true, data: compliance });
});

export const getComplianceStatistics = asyncHandler(async (req: Request, res: Response) => {
  const stats = await legalService.getComplianceStatistics();
  res.json({ success: true, data: stats });
});
