import { NotificationType, NotificationPriority, NotificationStatus } from './notification.model';

export interface CreateNotificationDto {
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  priority?: NotificationPriority;
}

export interface NotificationResponse {
  id: string;
  recipientId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityType?: string;
  relatedEntityId?: string;
  priority: NotificationPriority;
  status: NotificationStatus;
  readAt?: Date;
  createdAt: Date;
}

export interface NotificationFilters {
  status?: NotificationStatus;
  type?: NotificationType;
  priority?: NotificationPriority;
  relatedEntityType?: string;
  startDate?: Date;
  endDate?: Date;
}
