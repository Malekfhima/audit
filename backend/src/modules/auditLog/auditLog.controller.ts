import { Request, Response } from 'express';
import asyncHandler from '../../core/http/asyncHandler';
import { auditLogService } from './auditLog.service';

export const getLogs = asyncHandler(async (req: Request, res: Response) => {
  const filters: any = {};
  const pagination: any = {};

  if (req.query.entityType) filters.entityType = req.query.entityType;
  if (req.query.entityId) filters.entityId = req.query.entityId;
  if (req.query.performedById) filters.performedById = req.query.performedById;
  if (req.query.action) filters.action = req.query.action;
  if (req.query.severity) filters.severity = req.query.severity;
  if (req.query.from || req.query.to) {
    filters.dateRange = {};
    if (req.query.from) filters.dateRange.from = new Date(req.query.from as string);
    if (req.query.to) filters.dateRange.to = new Date(req.query.to as string);
  }

  if (req.query.page) pagination.page = parseInt(req.query.page as string);
  if (req.query.limit) pagination.limit = parseInt(req.query.limit as string);

  const result = await auditLogService.getLogs(filters, pagination);
  res.json({ success: true, ...result });
});

export const getEntityHistory = asyncHandler(async (req: Request, res: Response) => {
  const { entityType, entityId } = req.params;
  const pagination: any = {};

  if (req.query.page) pagination.page = parseInt(req.query.page as string);
  if (req.query.limit) pagination.limit = parseInt(req.query.limit as string);

  const logs = await auditLogService.getEntityHistory(entityType, entityId, pagination);
  res.json({ success: true, data: logs });
});

export const getUserActivity = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const dateRange: any = {};

  if (req.query.from) dateRange.from = new Date(req.query.from as string);
  if (req.query.to) dateRange.to = new Date(req.query.to as string);

  const logs = await auditLogService.getUserActivity(userId, dateRange);
  res.json({ success: true, data: logs });
});

export const getSecurityLogs = asyncHandler(async (req: Request, res: Response) => {
  const filters: any = {};

  if (req.query.from || req.query.to) {
    filters.dateRange = {};
    if (req.query.from) filters.dateRange.from = new Date(req.query.from as string);
    if (req.query.to) filters.dateRange.to = new Date(req.query.to as string);
  }

  const logs = await auditLogService.getSecurityLogs(filters);
  res.json({ success: true, data: logs });
});

export const cleanupOldLogs = asyncHandler(async (req: Request, res: Response) => {
  const { retentionDays } = req.body;
  const result = await auditLogService.cleanupOldLogs(retentionDays);
  res.json({ success: true, data: result });
});
