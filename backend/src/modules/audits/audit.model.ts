import { Schema, model, Document, Types } from 'mongoose';
import { AuditStatus, AuditType } from './audit.types';

export interface IAudit extends Document {
  title: string;
  auditNumber: string;
  type: AuditType;
  status: AuditStatus;
  normId: Types.ObjectId;
  siteId: Types.ObjectId;
  processIds: Types.ObjectId[];
  leadAuditorId: Types.ObjectId;
  auditorIds: Types.ObjectId[];
  auditeeIds: Types.ObjectId[];
  plannedStartDate: Date;
  plannedEndDate: Date;
  actualStartDate?: Date;
  actualEndDate?: Date;
  scope: string;
  objectives: string;
  conformityScore: number;
  summary: string;
  conclusions: string;
  recommendations: string;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const AuditSchema = new Schema<IAudit>(
  {
    title: {
      type: String,
      required: [true, 'Audit title is required'],
      trim: true,
    },
    auditNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    type: {
      type: String,
      enum: ['INTERNAL', 'EXTERNAL', 'CERTIFICATION', 'SURVEILLANCE', 'FOLLOW_UP'],
      required: true,
    },
    status: {
      type: String,
      enum: ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'PLANNED',
    },
    normId: {
      type: Schema.Types.ObjectId,
      ref: 'Norm',
      required: true,
    },
    siteId: {
      type: Schema.Types.ObjectId,
      ref: 'Site',
      required: true,
    },
    processIds: {
      type: [Schema.Types.ObjectId],
      ref: 'Process',
      default: [],
    },
    leadAuditorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    auditorIds: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    auditeeIds: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    plannedStartDate: {
      type: Date,
      required: true,
    },
    plannedEndDate: {
      type: Date,
      required: true,
    },
    actualStartDate: {
      type: Date,
    },
    actualEndDate: {
      type: Date,
    },
    scope: {
      type: String,
      trim: true,
    },
    objectives: {
      type: String,
      trim: true,
    },
    conformityScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    summary: {
      type: String,
      trim: true,
    },
    conclusions: {
      type: String,
      trim: true,
    },
    recommendations: {
      type: String,
      trim: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

AuditSchema.index({ status: 1 });
AuditSchema.index({ siteId: 1 });
AuditSchema.index({ normId: 1 });
AuditSchema.index({ plannedStartDate: 1 });
AuditSchema.index({ leadAuditorId: 1 });

AuditSchema.virtual('duration').get(function () {
  if (this.actualStartDate && this.actualEndDate) {
    return Math.floor((this.actualEndDate.getTime() - this.actualStartDate.getTime()) / (1000 * 60 * 60 * 24));
  }
  if (this.plannedStartDate && this.plannedEndDate) {
    return Math.floor((this.plannedEndDate.getTime() - this.plannedStartDate.getTime()) / (1000 * 60 * 60 * 24));
  }
  return 0;
});

AuditSchema.pre('save', async function(next) {
  if (!this.auditNumber) {
    const year = new Date().getFullYear();
    const count = await Audit.countDocuments({
      auditNumber: new RegExp(`^AUD-${year}-`),
    });
    this.auditNumber = `AUD-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export const Audit = model<IAudit>('Audit', AuditSchema);
