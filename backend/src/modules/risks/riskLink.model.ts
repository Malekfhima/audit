import { Schema, model, Document, Types } from 'mongoose';

export enum LinkedEntityType {
  AUDIT = 'AUDIT',
  NON_CONFORMITY = 'NON_CONFORMITY',
  CORRECTIVE_ACTION = 'CORRECTIVE_ACTION',
  LEGAL_REQUIREMENT = 'LEGAL_REQUIREMENT',
}

export enum LinkType {
  IDENTIFIED_BY = 'IDENTIFIED_BY',
  RELATED_TO = 'RELATED_TO',
  MITIGATES = 'MITIGATES',
}

export interface IRiskLink extends Document {
  riskId: Types.ObjectId;
  linkedEntityType: LinkedEntityType;
  linkedEntityId: Types.ObjectId;
  linkType: LinkType;
  notes?: string;
  createdAt: Date;
}

const RiskLinkSchema = new Schema<IRiskLink>(
  {
    riskId: {
      type: Schema.Types.ObjectId,
      ref: 'Risk',
      required: true,
    },
    linkedEntityType: {
      type: String,
      enum: Object.values(LinkedEntityType),
      required: true,
    },
    linkedEntityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    linkType: {
      type: String,
      enum: Object.values(LinkType),
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

RiskLinkSchema.index({ riskId: 1 });
RiskLinkSchema.index({ linkedEntityType: 1, linkedEntityId: 1 });
RiskLinkSchema.index({ linkType: 1 });

export const RiskLink = model<IRiskLink>('RiskLink', RiskLinkSchema);
