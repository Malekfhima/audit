import { Request, Response } from 'express';
import asyncHandler from '../../core/http/asyncHandler';
import { siteService } from './site.service';
import { parsePaginationParams } from '../../core/utils/pagination';
import { CreateSiteDto, UpdateSiteDto } from './site.types';

export const createSite = asyncHandler(async (req: Request, res: Response) => {
  const dto: CreateSiteDto = req.body;
  const site = await siteService.createSite(dto);
  res.status(201).json({ success: true, data: site });
});

export const getSite = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const site = await siteService.getSite(id);
  res.json({ success: true, data: site });
});

export const updateSite = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const dto: UpdateSiteDto = req.body;
  const site = await siteService.updateSite(id, dto);
  res.json({ success: true, data: site });
});

export const deleteSite = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await siteService.deleteSite(id);
  res.json({ success: true, message: 'Site deleted successfully' });
});

export const getAllSites = asyncHandler(async (req: Request, res: Response) => {
  const pagination = parsePaginationParams(req.query);
  const filters: any = {};

  if (req.query.isActive !== undefined) filters.isActive = req.query.isActive === 'true';
  if (req.query.city) filters.city = req.query.city;
  if (req.query.country) filters.country = req.query.country;
  if (req.query.siteManagerId) filters.siteManagerId = req.query.siteManagerId;
  if (req.query.search) filters.search = req.query.search;

  const result = await siteService.getAllSites(filters, pagination);
  res.json({ success: true, ...result });
});

export const activateSite = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const site = await siteService.activateSite(id);
  res.json({ success: true, data: site });
});

export const deactivateSite = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const site = await siteService.deactivateSite(id);
  res.json({ success: true, data: site });
});
