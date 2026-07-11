import { Request, Response } from 'express';
import asyncHandler from '../../core/http/asyncHandler';
import { normService } from './norm.service';
import { parsePaginationParams } from '../../core/utils/pagination';
import { CreateNormDto, UpdateNormDto } from './norm.types';

export const createNorm = asyncHandler(async (req: Request, res: Response) => {
  const dto: CreateNormDto = req.body;
  const norm = await normService.createNorm(dto, req.user._id);
  res.status(201).json({ success: true, data: norm });
});

export const getNorm = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const norm = await normService.getNorm(id);
  res.json({ success: true, data: norm });
});

export const updateNorm = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const dto: UpdateNormDto = req.body;
  const norm = await normService.updateNorm(id, dto);
  res.json({ success: true, data: norm });
});

export const deleteNorm = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await normService.deleteNorm(id);
  res.json({ success: true, message: 'Norm deleted successfully' });
});

export const getAllNorms = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePaginationParams(req.query);
  const filters: any = {};

  if (req.query.status) filters.status = req.query.status;
  if (req.query.category) filters.category = req.query.category;
  if (req.query.code) filters.code = req.query.code;
  if (req.query.search) filters.search = req.query.search;

  const result = await normService.getAllNorms(filters, pagination);
  res.json({ success: true, ...result });
});

export const activateNorm = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const norm = await normService.activateNorm(id);
  res.json({ success: true, data: norm });
});

export const archiveNorm = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const norm = await normService.archiveNorm(id);
  res.json({ success: true, data: norm });
});
