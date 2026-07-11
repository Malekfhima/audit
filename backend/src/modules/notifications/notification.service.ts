import { notificationRepository } from './notification.repository';
import { CreateNotificationDto, NotificationFilters } from './notification.types';
import { NotFoundError } from '../../core/http/httpError';
import { PaginationParams, createPaginationResult } from '../../core/utils/pagination';
import { INotification } from './notification.model';
import { User } from '../users/user.model';

class NotificationService {
  async createNotification(dto: CreateNotificationDto): Promise<INotification> {
    const user = await User.findById(dto.recipientId);
    if (!user) throw new NotFoundError('Recipient user not found');

    const notification = await notificationRepository.create(dto);
    return notification;
  }

  async sendNotification(
    recipientId: string,
    type: any,
    title: string,
    message: string,
    relatedEntityType?: string,
    relatedEntityId?: string,
    priority: any = 'MEDIUM'
  ): Promise<INotification> {
    return await this.createNotification({
      recipientId,
      type,
      title,
      message,
      relatedEntityType,
      relatedEntityId,
      priority,
    });
  }

  async getNotification(id: string): Promise<INotification> {
    const notification = await notificationRepository.findById(id);
    if (!notification) throw new NotFoundError('Notification not found');
    return notification;
  }

  async getNotifications(recipientId: string, filters: NotificationFilters, pagination: PaginationParams) {
    const notifications = await notificationRepository.findByRecipient(recipientId, filters, pagination);
    const total = await notificationRepository.countByRecipient(recipientId, filters);
    return createPaginationResult(notifications, total, pagination);
  }

  async markAsRead(id: string): Promise<INotification> {
    const notification = await notificationRepository.findById(id);
    if (!notification) throw new NotFoundError('Notification not found');

    const updated = await notificationRepository.markAsRead(id);
    if (!updated) throw new NotFoundError('Notification not found');
    return updated;
  }

  async markAllAsRead(recipientId: string): Promise<{ modifiedCount: number }> {
    return await notificationRepository.markAllAsRead(recipientId);
  }

  async archiveNotification(id: string): Promise<INotification> {
    const notification = await notificationRepository.findById(id);
    if (!notification) throw new NotFoundError('Notification not found');

    const updated = await notificationRepository.archiveNotification(id);
    if (!updated) throw new NotFoundError('Notification not found');
    return updated;
  }

  async deleteNotification(id: string): Promise<void> {
    const notification = await notificationRepository.findById(id);
    if (!notification) throw new NotFoundError('Notification not found');

    await notificationRepository.delete(id);
  }

  async deleteOldNotifications(daysOld: number) {
    return await notificationRepository.deleteOld(daysOld);
  }

  async getUnreadCount(recipientId: string): Promise<number> {
    return await notificationRepository.countUnread(recipientId);
  }

  async notifyAuditAssignment(auditId: string, auditorIds: string[]): Promise<void> {
    const notifications = auditorIds.map((auditorId) => ({
      recipientId: auditorId,
      type: 'AUDIT_ASSIGNED' as any,
      title: 'Audit Assigned',
      message: 'You have been assigned to a new audit.',
      relatedEntityType: 'Audit',
      relatedEntityId: auditId,
      priority: 'HIGH' as any,
    }));
    await notificationRepository.bulkCreate(notifications);
  }

  async notifyNCAssignment(ncId: string, assignedToId: string): Promise<void> {
    await this.sendNotification(
      assignedToId,
      'NC_ASSIGNED',
      'Non-Conformity Assigned',
      'You have been assigned to a non-conformity.',
      'NonConformity',
      ncId,
      'HIGH'
    );
  }

  async notifyActionOverdue(actionId: string, assignedToId: string): Promise<void> {
    await this.sendNotification(
      assignedToId,
      'ACTION_OVERDUE',
      'Corrective Action Overdue',
      'A corrective action assigned to you is overdue.',
      'CorrectiveAction',
      actionId,
      'URGENT'
    );
  }

  async scheduleReminders(): Promise<void> {
    // This would be called by a background job
    // Implementation depends on specific business logic
  }
}

export const notificationService = new NotificationService();
