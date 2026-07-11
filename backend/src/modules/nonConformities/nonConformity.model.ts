import { Schema, model, Document, Types } from 'mongoose';

export enum NCSeverity {
  CRITICAL = 'CRITICAL',
  MAJOR = 'MAJOR',
  MINOR = 'MINOR',
}

export enum NCCategory {
  DOCUMENTATION = 'DOCUMENTATION',
  PROCESS = 'PROCESS',
  EQUIPMENT = 'EQUIPMENT',
  PERSONNEL = 'PERSONNEL',
  ENVIRONMENT = 'ENVIRONMENT',
  QUALITY = 'QUALITY',
  SAFETY = 'SAFETY',
  OTHER = 'OTHER',
}

export enum NCStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export interface INonConformity extends Document {
  ncNumber: string;
  auditId: Types.ObjectId;
  auditEntryId?: Types.ObjectId;
  clauseId?: Types.ObjectId;
  description: string;
  rootCause?: string;
  immediateAction?: string;
  severity: NCSeverity;
  category: NCCategory;
  status: NCStatus;
  detectedById: Types.ObjectId;
  detectedAt: Date;
  assignedToId?: Types.ObjectId;
  siteId?: Types.ObjectId;
  processId?: Types.ObjectId;
  targetClosureDate?: Date;
  actualClosureDate?: Date;
  verifiedById?: Types.ObjectId;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NonConformitySchema = new Schema<INonConformity>(
  {
    ncNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    auditId: {
      type: Schema.Types.ObjectId,
      ref: 'Audit',
      required: true,
    },
    auditEntryId: {
      type: Schema.Types.ObjectId,
      ref: 'AuditEntry',
    },
    clauseId: {
      type: Schema.Types.ObjectId,
      ref: 'Clause',
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    rootCause: {
      type: String,
      trim: true,
    },
    immediateAction: {
      type: String,
      trim: true,
    },
    severity: {
      type: String,
      enum: Object.values(NCSeverity),
      required: true,
    },
    category: {
      type: String,
      enum: Object.values(NCCategory),
      required: true,
    },
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED'] as const,
      default: 'OPEN' as any,
    },
    detectedById: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    detectedAt: {
      type: Date,
      default: Date.now,
    },
    assignedToId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    siteId: {
      type: Schema.Types.ObjectId,
      ref: 'Site',
    },
    processId: {
      type: Schema.Types.ObjectId,
      ref: 'Process',
    },
    targetClosureDate: {
      type: Date,
    },
    actualClosureDate: {
      type: Date,
    },
    verifiedById: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

NonConformitySchema.index({ auditId: 1 });
NonConformitySchema.index({ status: 1 });
NonConformitySchema.index({ severity: 1 });
NonConformitySchema.index({ assignedToId: 1 });
NonConformitySchema.index({ detectedById: 1 });

NonConformitySchema.pre('save', async function(next) {
  const doc = this as any;
  if (!doc.ncNumber) {
    const year = new Date().getFullYear();
    const count = await NonConformity.countDocuments({
      ncNumber: new RegExp(`^NC-${year}-`),
    });
    doc.ncNumber = `NC-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export const NonConformity = model<INonConformity>('NonConformity', NonConformitySchema);
