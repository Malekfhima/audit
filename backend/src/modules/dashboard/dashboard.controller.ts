import { Request, Response } from 'express';
import asyncHandler from '../../core/http/asyncHandler';
import { dashboardService } from './dashboard.service';
import { DashboardFilters } from './dashboard.types';

export const getOverviewStats = asyncHandler(async (req: Request, res: Response) => {
  const filters: DashboardFilters = {};

  if (req.query.siteId) filters.siteId = req.query.siteId as string;
  if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
  if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);
  if (req.query.userId) filters.userId = req.query.userId as string;

  const stats = await dashboardService.getOverviewStats(filters);
  res.json({ success: true, data: stats });
});

export const getTimeSeriesData = asyncHandler(async (req: Request, res: Response) => {
  const { metric } = req.params;
  const { from, to } = req.query;

  if (!from || !to) {
    return res.status(400).json({ success: false, message: 'from and to date range required' });
  }

  const filters: DashboardFilters = {};
  if (req.query.siteId) filters.siteId = req.query.siteId as string;
  if (req.query.userId) filters.userId = req.query.userId as string;

  const data = await dashboardService.getTimeSeriesData(
    metric,
    { from: new Date(from as string), to: new Date(to as string) },
    filters
  );
  res.json({ success: true, data });
});

export const getTopIssues = asyncHandler(async (req: Request, res: Response) => {
  const filters: DashboardFilters = {};

  if (req.query.siteId) filters.siteId = req.query.siteId as string;
  if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
  if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);
  if (req.query.userId) filters.userId = req.query.userId as string;

  const issues = await dashboardService.getTopIssues(filters);
  res.json({ success: true, data: issues });
});
