import { Schema, model, Document, Types } from 'mongoose';

export enum NotificationType {
  AUDIT_ASSIGNED = 'AUDIT_ASSIGNED',
  AUDIT_STARTING_SOON = 'AUDIT_STARTING_SOON',
  NC_ASSIGNED = 'NC_ASSIGNED',
  NC_DUE_SOON = 'NC_DUE_SOON',
  ACTION_ASSIGNED = 'ACTION_ASSIGNED',
  ACTION_OVERDUE = 'ACTION_OVERDUE',
  COMPLIANCE_REVIEW_DUE = 'COMPLIANCE_REVIEW_DUE',
  RISK_REVIEW_DUE = 'RISK_REVIEW_DUE',
  GENERAL = 'GENERAL',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
  ARCHIVED = 'ARCHIVED',
}

export interface INotification extends Document {
  recipientId: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntityType?: string;
  relatedEntityId?: Types.ObjectId;
  priority: NotificationPriority;
  status: NotificationStatus;
  readAt?: Date;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(NotificationType),
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    relatedEntityType: {
      type: String,
    },
    relatedEntityId: {
      type: Schema.Types.ObjectId,
    },
    priority: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as const,
      default: 'MEDIUM' as any,
    },
    status: {
      type: String,
      enum: ['UNREAD', 'READ', 'ARCHIVED'] as const,
      default: 'UNREAD' as any,
    },
    readAt: {
      type: Date,
    },
  },
  { timestamps: false }
);

NotificationSchema.index({ recipientId: 1, status: 1 });
NotificationSchema.index({ recipientId: 1 });
NotificationSchema.index({ createdAt: -1 });

export const Notification = model<INotification>('Notification', NotificationSchema);
