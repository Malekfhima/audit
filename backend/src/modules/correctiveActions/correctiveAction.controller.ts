import { Request, Response } from 'express';
import asyncHandler from '../../core/http/asyncHandler';
import { correctiveActionService } from './correctiveAction.service';
import { parsePaginationParams } from '../../core/utils/pagination';
import { CreateCorrectiveActionDto, UpdateCorrectiveActionDto } from './correctiveAction.types';

export const createAction = asyncHandler(async (req: Request, res: Response) => {
  const dto: CreateCorrectiveActionDto = req.body;
  const action = await correctiveActionService.createAction(dto);
  res.status(201).json({ success: true, data: action });
});

export const getAction = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const action = await correctiveActionService.getAction(id);
  res.json({ success: true, data: action });
});

export const updateAction = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const dto: UpdateCorrectiveActionDto = req.body;
  const action = await correctiveActionService.updateAction(id, dto);
  res.json({ success: true, data: action });
});

export const deleteAction = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await correctiveActionService.deleteAction(id);
  res.json({ success: true, message: 'Corrective action deleted successfully' });
});

export const getAllActions = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePaginationParams(req.query);
  const filters: any = {};

  if (req.query.status) filters.status = req.query.status;
  if (req.query.actionType) filters.actionType = req.query.actionType;
  if (req.query.nonConformityId) filters.nonConformityId = req.query.nonConformityId;
  if (req.query.responsibleId) filters.responsibleId = req.query.responsibleId;
  if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
  if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);
  if (req.query.search) filters.search = req.query.search;

  const result = await correctiveActionService.getAllActions(filters, pagination);
  res.json({ success: true, ...result });
});

export const getActionsByNC = asyncHandler(async (req: Request, res: Response) => {
  const { ncId } = req.params;
  const actions = await correctiveActionService.getActionsByNC(ncId);
  res.json({ success: true, data: actions });
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const action = await correctiveActionService.updateStatus(id, status);
  res.json({ success: true, data: action });
});

export const markAsCompleted = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { completedDate } = req.body;
  const action = await correctiveActionService.markAsCompleted(id, completedDate);
  res.json({ success: true, data: action });
});

export const verifyEffectiveness = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { effectivenessCheck, isEffective } = req.body;
  const action = await correctiveActionService.verifyEffectiveness(id, req.user._id, effectivenessCheck, isEffective);
  res.json({ success: true, data: action });
});

export const markAsIneffective = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { reason } = req.body;
  const action = await correctiveActionService.markAsIneffective(id, reason);
  res.json({ success: true, data: action });
});

export const getOverdueActions = asyncHandler(async (req: Request, res: Response) => {
  const actions = await correctiveActionService.getOverdueActions();
  res.json({ success: true, data: actions });
});

export const getActionsStatistics = asyncHandler(async (req: Request, res: Response) => {
  const stats = await correctiveActionService.getActionsStatistics();
  res.json({ success: true, data: stats });
});

export const getActionsByResponsible = asyncHandler(async (req: Request, res: Response) => {
  const { responsibleId } = req.params;
  const actions = await correctiveActionService.getActionsByResponsible(responsibleId);
  res.json({ success: true, data: actions });
});
