import { Request, Response } from 'express';
import asyncHandler from '../../core/http/asyncHandler';
import { reportService } from './report.service';
import { parsePaginationParams } from '../../core/utils/pagination';
import { GenerateReportDto } from './report.types';

export const generateReport = asyncHandler(async (req: Request, res: Response) => {
  const dto: GenerateReportDto = req.body;
  const userId = (req as any).user.id;
  const report = await reportService.generateReport(dto, userId);
  res.status(201).json({ success: true, data: report });
});

export const getReport = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const report = await reportService.getReport(id);
  res.json({ success: true, data: report });
});

export const deleteReport = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await reportService.deleteReport(id);
  res.json({ success: true, message: 'Report deleted successfully' });
});

export const getUserReports = asyncHandler(async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const pagination = parsePaginationParams(req.query);
  const filters: any = {};

  if (req.query.type) filters.type = req.query.type;
  if (req.query.status) filters.status = req.query.status;
  if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
  if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);

  const result = await reportService.getUserReports(userId, filters, pagination);
  res.json({ success: true, ...result });
});

export const getAllReports = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePaginationParams(req.query);
  const filters: any = {};

  if (req.query.type) filters.type = req.query.type;
  if (req.query.status) filters.status = req.query.status;
  if (req.query.generatedById) filters.generatedById = req.query.generatedById;
  if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
  if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);

  const result = await reportService.getAllReports(filters, pagination);
  res.json({ success: true, ...result });
});

export const markAsCompleted = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { filePath, fileSize } = req.body;
  const report = await reportService.markAsCompleted(id, filePath, fileSize);
  res.json({ success: true, data: report });
});

export const markAsFailed = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { error } = req.body;
  const report = await reportService.markAsFailed(id, error);
  res.json({ success: true, data: report });
});

export const deleteExpiredReports = asyncHandler(async (req: Request, res: Response) => {
  const result = await reportService.deleteExpiredReports();
  res.json({ success: true, data: result });
});
