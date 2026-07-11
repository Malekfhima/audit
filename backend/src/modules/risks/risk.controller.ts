import { Request, Response } from 'express';
import asyncHandler from '../../core/http/asyncHandler';
import { riskService } from './risk.service';
import { parsePaginationParams } from '../../core/utils/pagination';
import { CreateRiskDto, UpdateRiskDto } from './risk.types';

export const createRisk = asyncHandler(async (req: Request, res: Response) => {
  const dto: CreateRiskDto = req.body;
  const risk = await riskService.createRisk(dto);
  res.status(201).json({ success: true, data: risk });
});

export const getRisk = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const risk = await riskService.getRisk(id);
  res.json({ success: true, data: risk });
});

export const updateRisk = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const dto: UpdateRiskDto = req.body;
  const risk = await riskService.updateRisk(id, dto);
  res.json({ success: true, data: risk });
});

export const deleteRisk = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await riskService.deleteRisk(id);
  res.json({ success: true, message: 'Risk deleted successfully' });
});

export const getAllRisks = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePaginationParams(req.query);
  const filters: any = {};

  if (req.query.status) filters.status = req.query.status;
  if (req.query.riskLevel) filters.riskLevel = req.query.riskLevel;
  if (req.query.category) filters.category = req.query.category;
  if (req.query.siteId) filters.siteId = req.query.siteId;
  if (req.query.processId) filters.processId = req.query.processId;
  if (req.query.ownerId) filters.ownerId = req.query.ownerId;
  if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
  if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);
  if (req.query.search) filters.search = req.query.search;

  const result = await riskService.getAllRisks(filters, pagination);
  res.json({ success: true, ...result });
});

export const assessRisk = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { probability, impact } = req.body;
  const risk = await riskService.assessRisk(id, probability, impact);
  res.json({ success: true, data: risk });
});

export const addMitigationPlan = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { mitigationPlan, contingencyPlan } = req.body;
  const risk = await riskService.addMitigationPlan(id, mitigationPlan, contingencyPlan);
  res.json({ success: true, data: risk });
});

export const updateResidualRisk = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { residualProbability, residualImpact } = req.body;
  const risk = await riskService.updateResidualRisk(id, residualProbability, residualImpact);
  res.json({ success: true, data: risk });
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const risk = await riskService.updateStatus(id, status);
  res.json({ success: true, data: risk });
});

export const assignOwner = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { ownerId } = req.body;
  const risk = await riskService.assignOwner(id, ownerId);
  res.json({ success: true, data: risk });
});

export const getRiskMatrix = asyncHandler(async (req: Request, res: Response) => {
  const matrix = await riskService.getRiskMatrix();
  res.json({ success: true, data: matrix });
});

export const getRisksByLevel = asyncHandler(async (req: Request, res: Response) => {
  const { level } = req.params;
  const risks = await riskService.getRisksByLevel(level);
  res.json({ success: true, data: risks });
});

export const getRisksByOwner = asyncHandler(async (req: Request, res: Response) => {
  const { ownerId } = req.params;
  const risks = await riskService.getRisksByOwner(ownerId);
  res.json({ success: true, data: risks });
});

export const getRisksNeedingReview = asyncHandler(async (req: Request, res: Response) => {
  const risks = await riskService.getRisksNeedingReview();
  res.json({ success: true, data: risks });
});

export const getRiskStatistics = asyncHandler(async (req: Request, res: Response) => {
  const stats = await riskService.getRiskStatistics();
  res.json({ success: true, data: stats });
});

export const linkRiskToEntity = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { linkedEntityType, linkedEntityId, linkType, notes } = req.body;
  const link = await riskService.linkRiskToEntity(id, linkedEntityType, linkedEntityId, linkType, notes);
  res.status(201).json({ success: true, data: link });
});

export const unlinkRisk = asyncHandler(async (req: Request, res: Response) => {
  const { linkId } = req.params;
  await riskService.unlinkRisk(linkId);
  res.json({ success: true, message: 'Risk link deleted successfully' });
});

export const getRiskLinks = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const links = await riskService.getRiskLinks(id);
  res.json({ success: true, data: links });
});

export const getEntityLinks = asyncHandler(async (req: Request, res: Response) => {
  const { linkedEntityType, linkedEntityId } = req.params;
  const links = await riskService.getEntityLinks(linkedEntityType, linkedEntityId);
  res.json({ success: true, data: links });
});
