import { Notification, INotification } from './notification.model';
import { CreateNotificationDto, NotificationFilters } from './notification.types';
import { PaginationParams, getPaginationOptions } from '../../core/utils/pagination';

class NotificationRepository {
  async create(data: CreateNotificationDto): Promise<INotification> {
    const notification = await Notification.create(data);
    return notification;
  }

  async bulkCreate(data: CreateNotificationDto[]): Promise<INotification[]> {
    const notifications = await Notification.insertMany(data);
    return notifications as any;
  }

  async findById(id: string): Promise<INotification | null> {
    return await Notification.findById(id).populate('recipientId', 'firstName lastName email');
  }

  async update(id: string, data: Partial<INotification>): Promise<INotification | null> {
    return await Notification.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Notification.findByIdAndDelete(id);
    return !!result;
  }

  async findByRecipient(recipientId: string, filters: NotificationFilters, pagination: PaginationParams): Promise<INotification[]> {
    const { skip, limit, sort } = getPaginationOptions(pagination);
    const query = this.buildQuery(filters);
    query.recipientId = recipientId;

    return await Notification.find(query)
      .populate('recipientId', 'firstName lastName email')
      .skip(skip)
      .limit(limit)
      .sort(sort);
  }

  async countByRecipient(recipientId: string, filters: NotificationFilters): Promise<number> {
    const query = this.buildQuery(filters);
    query.recipientId = recipientId;
    return await Notification.countDocuments(query);
  }

  async markAsRead(id: string): Promise<INotification | null> {
    return await Notification.findByIdAndUpdate(
      id,
      { status: 'READ', readAt: new Date() },
      { new: true }
    );
  }

  async markAllAsRead(recipientId: string): Promise<{ modifiedCount: number }> {
    return await Notification.updateMany(
      { recipientId, status: 'UNREAD' },
      { status: 'READ', readAt: new Date() }
    );
  }

  async archiveNotification(id: string): Promise<INotification | null> {
    return await Notification.findByIdAndUpdate(id, { status: 'ARCHIVED' }, { new: true });
  }

  async deleteOld(daysOld: number): Promise<{ deletedCount?: number }> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - daysOld);
    return await Notification.deleteMany({
      createdAt: { $lt: cutoff },
      status: { $in: ['READ', 'ARCHIVED'] },
    });
  }

  async countUnread(recipientId: string): Promise<number> {
    return await Notification.countDocuments({ recipientId, status: 'UNREAD' });
  }

  private buildQuery(filters: NotificationFilters): any {
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.priority) {
      query.priority = filters.priority;
    }

    if (filters.relatedEntityType) {
      query.relatedEntityType = filters.relatedEntityType;
    }

    if (filters.startDate || filters.endDate) {
      query.createdAt = {};
      if (filters.startDate) {
        query.createdAt.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.createdAt.$lte = filters.endDate;
      }
    }

    return query;
  }
}

export const notificationRepository = new NotificationRepository();
