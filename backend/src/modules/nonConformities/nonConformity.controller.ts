import { Request, Response } from 'express';
import asyncHandler from '../../core/http/asyncHandler';
import { nonConformityService } from './nonConformity.service';
import { parsePaginationParams } from '../../core/utils/pagination';
import { CreateNonConformityDto, UpdateNonConformityDto } from './nonConformity.types';

export const createNC = asyncHandler(async (req: Request, res: Response) => {
  const dto: CreateNonConformityDto = req.body;
  const nc = await nonConformityService.createNC(dto);
  res.status(201).json({ success: true, data: nc });
});

export const getNC = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const nc = await nonConformityService.getNC(id);
  res.json({ success: true, data: nc });
});

export const updateNC = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const dto: UpdateNonConformityDto = req.body;
  const nc = await nonConformityService.updateNC(id, dto);
  res.json({ success: true, data: nc });
});

export const deleteNC = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await nonConformityService.deleteNC(id);
  res.json({ success: true, message: 'Non-conformity deleted successfully' });
});

export const getAllNCs = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePaginationParams(req.query);
  const filters: any = {};

  if (req.query.status) filters.status = req.query.status;
  if (req.query.severity) filters.severity = req.query.severity;
  if (req.query.category) filters.category = req.query.category;
  if (req.query.auditId) filters.auditId = req.query.auditId;
  if (req.query.assignedToId) filters.assignedToId = req.query.assignedToId;
  if (req.query.siteId) filters.siteId = req.query.siteId;
  if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
  if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);
  if (req.query.search) filters.search = req.query.search;

  const result = await nonConformityService.getAllNCs(filters, pagination);
  res.json({ success: true, ...result });
});

export const assignNC = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { assignedToId, targetClosureDate } = req.body;
  const nc = await nonConformityService.assignNC(id, assignedToId, targetClosureDate);
  res.json({ success: true, data: nc });
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const nc = await nonConformityService.updateStatus(id, status);
  res.json({ success: true, data: nc });
});

export const addRootCause = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rootCause } = req.body;
  const nc = await nonConformityService.addRootCause(id, rootCause);
  res.json({ success: true, data: nc });
});

export const addImmediateAction = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { immediateAction } = req.body;
  const nc = await nonConformityService.addImmediateAction(id, immediateAction);
  res.json({ success: true, data: nc });
});

export const closeNC = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { actualClosureDate } = req.body;
  const nc = await nonConformityService.closeNC(id, actualClosureDate);
  res.json({ success: true, data: nc });
});

export const verifyNC = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const nc = await nonConformityService.verifyNC(id, req.user._id);
  res.json({ success: true, data: nc });
});

export const reopenNC = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const nc = await nonConformityService.reopenNC(id, reason);
  res.json({ success: true, data: nc });
});

export const getNCStatistics = asyncHandler(async (req: Request, res: Response) => {
  const stats = await nonConformityService.getNCStatistics();
  res.json({ success: true, data: stats });
});

export const getNCsByAudit = asyncHandler(async (req: Request, res: Response) => {
  const { auditId } = req.params;
  const ncs = await nonConformityService.getNCsByAudit(auditId);
  res.json({ success: true, data: ncs });
});

export const getOpenNCs = asyncHandler(async (req: Request, res: Response) => {
  const ncs = await nonConformityService.getOpenNCs();
  res.json({ success: true, data: ncs });
});
