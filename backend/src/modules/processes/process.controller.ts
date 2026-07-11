import { Request, Response } from 'express';
import asyncHandler from '../../core/http/asyncHandler';
import { processService } from './process.service';
import { parsePaginationParams } from '../../core/utils/pagination';
import { CreateProcessDto, UpdateProcessDto } from './process.types';

export const createProcess = asyncHandler(async (req: Request, res: Response) => {
  const dto: CreateProcessDto = req.body;
  const process = await processService.createProcess(dto);
  res.status(201).json({ success: true, data: process });
});

export const getProcess = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const process = await processService.getProcess(id);
  res.json({ success: true, data: process });
});

export const updateProcess = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const dto: UpdateProcessDto = req.body;
  const process = await processService.updateProcess(id, dto);
  res.json({ success: true, data: process });
});

export const deleteProcess = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await processService.deleteProcess(id);
  res.json({ success: true, message: 'Process deleted successfully' });
});

export const getAllProcesses = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePaginationParams(req.query);
  const filters: any = {};

  if (req.query.siteId) filters.siteId = req.query.siteId;
  if (req.query.category) filters.category = req.query.category;
  if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';
  if (req.query.search) filters.search = req.query.search;

  const result = await processService.getAllProcesses(filters, pagination);
  res.json({ success: true, ...result });
});

export const getProcessesBySite = asyncHandler(async (req: Request, res: Response) => {
  const { siteId } = req.params;
  const processes = await processService.getProcessesBySite(siteId);
  res.json({ success: true, data: processes });
});

export const activateProcess = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const process = await processService.activateProcess(id);
  res.json({ success: true, data: process });
});

export const deactivateProcess = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const process = await processService.deactivateProcess(id);
  res.json({ success: true, data: process });
});
