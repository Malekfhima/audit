import { Request, Response } from 'express';
import asyncHandler from '../../core/http/asyncHandler';
import { auditService } from './audit.service';
import { parsePaginationParams } from '../../core/utils/pagination';
import { CreateAuditDto, UpdateAuditDto } from './audit.types';

export const createAudit = asyncHandler(async (req: Request, res: Response) => {
  const dto: CreateAuditDto = req.body;
  const audit = await auditService.createAudit(dto, req.user._id);
  res.status(201).json({ success: true, data: audit });
});

export const getAudit = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const audit = await auditService.getAudit(id);
  res.json({ success: true, data: audit });
});

export const updateAudit = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const dto: UpdateAuditDto = req.body;
  const audit = await auditService.updateAudit(id, dto);
  res.json({ success: true, data: audit });
});

export const deleteAudit = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await auditService.deleteAudit(id);
  res.json({ success: true, message: 'Audit deleted successfully' });
});

export const getAllAudits = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePaginationParams(req.query);
  const filters: any = {};

  if (req.query.status) filters.status = req.query.status;
  if (req.query.type) filters.type = req.query.type;
  if (req.query.siteId) filters.siteId = req.query.siteId;
  if (req.query.normId) filters.normId = req.query.normId;
  if (req.query.leadAuditorId) filters.leadAuditorId = req.query.leadAuditorId;
  if (req.query.auditorId) filters.auditorId = req.query.auditorId;
  if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
  if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);
  if (req.query.search) filters.search = req.query.search;

  const result = await auditService.getAllAudits(filters, pagination);
  res.json({ success: true, ...result });
});

export const startAudit = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const audit = await auditService.startAudit(id);
  res.json({ success: true, data: audit });
});

export const completeAudit = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const audit = await auditService.completeAudit(id);
  res.json({ success: true, data: audit });
});

export const cancelAudit = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const audit = await auditService.cancelAudit(id);
  res.json({ success: true, data: audit });
});

export const addSummary = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { summary, conclusions, recommendations } = req.body;
  const audit = await auditService.addSummary(id, summary, conclusions, recommendations);
  res.json({ success: true, data: audit });
});

export const assignAuditors = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { auditorIds } = req.body;
  const audit = await auditService.assignAuditors(id, auditorIds);
  res.json({ success: true, data: audit });
});

export const assignAuditees = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { auditeeIds } = req.body;
  const audit = await auditService.assignAuditees(id, auditeeIds);
  res.json({ success: true, data: audit });
});

export const calculateScore = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const audit = await auditService.calculateConformityScore(id);
  res.json({ success: true, data: audit });
});

export const getUpcomingAudits = asyncHandler(async (req: Request, res: Response) => {
  const audits = await auditService.getUpcomingAudits();
  res.json({ success: true, data: audits });
});

export const getActiveAudits = asyncHandler(async (req: Request, res: Response) => {
  const audits = await auditService.getActiveAudits();
  res.json({ success: true, data: audits });
});

export const getCompletedAudits = asyncHandler(async (req: Request, res: Response) => {
  const audits = await auditService.getCompletedAudits();
  res.json({ success: true, data: audits });
});
