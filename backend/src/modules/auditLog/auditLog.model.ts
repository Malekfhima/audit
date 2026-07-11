// ==============================================
// MODULE: AUDIT LOG - MONGOOSE MODEL
// ==============================================

import mongoose, { Schema, Document, Types } from 'mongoose';

export type AuditLogSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface AuditLogChange {
  before?: Record<string, any>;
  after?: Record<string, any>;
}

export interface AuditLogDocument extends Document {
  action: string;
  entityType?: string;
  entityId?: Types.ObjectId;
  performedById?: Types.ObjectId;
  performedAt: Date;
  ipAddress?: string;
  userAgent?: string;
  changes?: AuditLogChange;
  metadata?: Record<string, any>;
  severity: AuditLogSeverity;
}

const AuditLogSchema = new Schema<AuditLogDocument>(
  {
    action: { type: String, required: true },
    entityType: { type: String },
    entityId: { type: Schema.Types.ObjectId },
    performedById: { type: Schema.Types.ObjectId, ref: 'User' },
    performedAt: { type: Date, default: Date.now },
    ipAddress: { type: String },
    userAgent: { type: String },
    changes: {
      before: { type: Schema.Types.Mixed },
      after: { type: Schema.Types.Mixed },
    },
    metadata: { type: Schema.Types.Mixed },
    severity: { type: String, enum: ['INFO', 'WARNING', 'CRITICAL'], default: 'INFO' },
  },
  {
    timestamps: false,
  }
);

// Indexes
AuditLogSchema.index({ performedAt: -1 });
AuditLogSchema.index({ entityType: 1, entityId: 1 });
AuditLogSchema.index({ performedById: 1 });
AuditLogSchema.index({ action: 1 });

export const AuditLog = mongoose.model<AuditLogDocument>('AuditLog', AuditLogSchema);
