import { Schema, model, Document, Types } from 'mongoose';

export enum ReportType {
  AUDIT_SUMMARY = 'AUDIT_SUMMARY',
  NC_REPORT = 'NC_REPORT',
  ACTION_TRACKING = 'ACTION_TRACKING',
  RISK_REGISTER = 'RISK_REGISTER',
  COMPLIANCE_REPORT = 'COMPLIANCE_REPORT',
  SITE_PERFORMANCE = 'SITE_PERFORMANCE',
  USER_ACTIVITY = 'USER_ACTIVITY',
  CUSTOM = 'CUSTOM',
}

export enum ReportFormat {
  PDF = 'PDF',
  EXCEL = 'EXCEL',
  CSV = 'CSV',
}

export enum ReportStatus {
  GENERATING = 'GENERATING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface IReport extends Document {
  reportNumber: string;
  name: string;
  type: ReportType;
  format: ReportFormat;
  filters: Record<string, any>;
  status: ReportStatus;
  filePath?: string;
  fileSize?: number;
  generatedById: Types.ObjectId;
  generatedAt: Date;
  expiresAt?: Date;
  error?: string;
  createdAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reportNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(ReportType),
      required: true,
    },
    format: {
      type: String,
      enum: Object.values(ReportFormat),
      required: true,
    },
    filters: {
      type: Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ['GENERATING', 'COMPLETED', 'FAILED'] as const,
      default: 'GENERATING' as any,
    },
    filePath: {
      type: String,
      trim: true,
    },
    fileSize: {
      type: Number,
    },
    generatedById: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
    },
    error: {
      type: String,
      trim: true,
    },
  },
  { timestamps: false }
);

ReportSchema.index({ generatedById: 1 });
ReportSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
ReportSchema.index({ type: 1 });
ReportSchema.index({ status: 1 });

ReportSchema.pre('save', async function(next) {
  const doc = this as any;
  if (!doc.reportNumber) {
    const year = new Date().getFullYear();
    const count = await Report.countDocuments({
      reportNumber: new RegExp(`^RPT-${year}-`),
    });
    doc.reportNumber = `RPT-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export const Report = model<IReport>('Report', ReportSchema);
