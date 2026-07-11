import { Schema, model, Document, Types } from 'mongoose';

export enum ComplianceStatus {
  COMPLIANT = 'COMPLIANT',
  NON_COMPLIANT = 'NON_COMPLIANT',
  PARTIALLY_COMPLIANT = 'PARTIALLY_COMPLIANT',
  PENDING_ASSESSMENT = 'PENDING_ASSESSMENT',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
}

export interface ILegalCompliance extends Document {
  legalRequirementId: Types.ObjectId;
  siteId: Types.ObjectId;
  complianceStatus: ComplianceStatus;
  assessmentDate: Date;
  assessedById: Types.ObjectId;
  evidence?: string;
  evidenceAttachments?: string[];
  gaps?: string;
  actionPlanId?: Types.ObjectId;
  nextReviewDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const LegalComplianceSchema = new Schema<ILegalCompliance>(
  {
    legalRequirementId: {
      type: Schema.Types.ObjectId,
      ref: 'LegalRequirement',
      required: true,
    },
    siteId: {
      type: Schema.Types.ObjectId,
      ref: 'Site',
      required: true,
    },
    complianceStatus: {
      type: String,
      enum: ['COMPLIANT', 'NON_COMPLIANT', 'PARTIALLY_COMPLIANT', 'PENDING_ASSESSMENT', 'NOT_APPLICABLE'] as const,
      default: 'PENDING_ASSESSMENT' as any,
    },
    assessmentDate: {
      type: Date,
      default: Date.now,
    },
    assessedById: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    evidence: {
      type: String,
      trim: true,
    },
    evidenceAttachments: {
      type: [String],
      default: [],
    },
    gaps: {
      type: String,
      trim: true,
    },
    actionPlanId: {
      type: Schema.Types.ObjectId,
      ref: 'CorrectiveAction',
    },
    nextReviewDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

LegalComplianceSchema.index({ legalRequirementId: 1, siteId: 1 }, { unique: true });
LegalComplianceSchema.index({ complianceStatus: 1 });
LegalComplianceSchema.index({ siteId: 1 });
LegalComplianceSchema.index({ nextReviewDate: 1 });

export const LegalCompliance = model<ILegalCompliance>('LegalCompliance', LegalComplianceSchema);
