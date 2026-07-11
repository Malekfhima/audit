import { Schema, model, Document, Types } from 'mongoose';

export enum LegalCategory {
  QUALITY = 'QUALITY',
  ENVIRONMENT = 'ENVIRONMENT',
  HEALTH_AND_SAFETY = 'HEALTH_AND_SAFETY',
  LABOR = 'LABOR',
  DATA_PROTECTION = 'DATA_PROTECTION',
  FINANCIAL = 'FINANCIAL',
  TAX = 'TAX',
  INDUSTRY_SPECIFIC = 'INDUSTRY_SPECIFIC',
  OTHER = 'OTHER',
}

export interface ILegalRequirement extends Document {
  requirementNumber: string;
  title: string;
  reference: string;
  description: string;
  category: LegalCategory;
  jurisdiction: string;
  authority: string;
  effectiveDate: Date;
  expiryDate?: Date;
  reviewDate: Date;
  url?: string;
  attachments?: string[];
  applicableSites?: Types.ObjectId[];
  responsibleId: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LegalRequirementSchema = new Schema<ILegalRequirement>(
  {
    requirementNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    reference: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: Object.values(LegalCategory),
      required: true,
    },
    jurisdiction: {
      type: String,
      required: true,
      trim: true,
    },
    authority: {
      type: String,
      required: true,
      trim: true,
    },
    effectiveDate: {
      type: Date,
      required: true,
    },
    expiryDate: {
      type: Date,
    },
    reviewDate: {
      type: Date,
      required: true,
    },
    url: {
      type: String,
      trim: true,
    },
    attachments: {
      type: [String],
      default: [],
    },
    applicableSites: {
      type: [Schema.Types.ObjectId],
      ref: 'Site',
      default: [],
    },
    responsibleId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

LegalRequirementSchema.index({ category: 1 });
LegalRequirementSchema.index({ jurisdiction: 1 });
LegalRequirementSchema.index({ effectiveDate: 1 });
LegalRequirementSchema.index({ responsibleId: 1 });
LegalRequirementSchema.index({ isActive: 1 });

LegalRequirementSchema.pre('save', async function(next) {
  const doc = this as any;
  if (!doc.requirementNumber) {
    const year = new Date().getFullYear();
    const count = await LegalRequirement.countDocuments({
      requirementNumber: new RegExp(`^LR-${year}-`),
    });
    doc.requirementNumber = `LR-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export const LegalRequirement = model<ILegalRequirement>('LegalRequirement', LegalRequirementSchema);
