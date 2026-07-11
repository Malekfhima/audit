import { Request, Response } from 'express';
import asyncHandler from '../../core/http/asyncHandler';
import { notificationService } from './notification.service';
import { parsePaginationParams } from '../../core/utils/pagination';
import { CreateNotificationDto } from './notification.types';

export const createNotification = asyncHandler(async (req: Request, res: Response) => {
  const dto: CreateNotificationDto = req.body;
  const notification = await notificationService.createNotification(dto);
  res.status(201).json({ success: true, data: notification });
});

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const recipientId = (req as any).user.id;
  const pagination = parsePaginationParams(req.query);
  const filters: any = {};

  if (req.query.status) filters.status = req.query.status;
  if (req.query.type) filters.type = req.query.type;
  if (req.query.priority) filters.priority = req.query.priority;
  if (req.query.relatedEntityType) filters.relatedEntityType = req.query.relatedEntityType;
  if (req.query.startDate) filters.startDate = new Date(req.query.startDate as string);
  if (req.query.endDate) filters.endDate = new Date(req.query.endDate as string);

  const result = await notificationService.getNotifications(recipientId, filters, pagination);
  res.json({ success: true, ...result });
});

export const getNotification = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const notification = await notificationService.getNotification(id);
  res.json({ success: true, data: notification });
});

export const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
  const recipientId = (req as any).user.id;
  const count = await notificationService.getUnreadCount(recipientId);
  res.json({ success: true, data: { count } });
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const notification = await notificationService.markAsRead(id);
  res.json({ success: true, data: notification });
});

export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  const recipientId = (req as any).user.id;
  const result = await notificationService.markAllAsRead(recipientId);
  res.json({ success: true, data: result });
});

export const archiveNotification = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const notification = await notificationService.archiveNotification(id);
  res.json({ success: true, data: notification });
});

export const deleteNotification = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await notificationService.deleteNotification(id);
  res.json({ success: true, message: 'Notification deleted successfully' });
});

export const deleteOldNotifications = asyncHandler(async (req: Request, res: Response) => {
  const { daysOld } = req.body;
  const result = await notificationService.deleteOldNotifications(daysOld);
  res.json({ success: true, data: result });
});
