import { Schema, model, Document, Types } from 'mongoose';

export enum RiskCategory {
  FINANCIAL = 'FINANCIAL',
  OPERATIONAL = 'OPERATIONAL',
  COMPLIANCE = 'COMPLIANCE',
  STRATEGIC = 'STRATEGIC',
  REPUTATIONAL = 'REPUTATIONAL',
  HEALTH_AND_SAFETY = 'HEALTH_AND_SAFETY',
  ENVIRONMENTAL = 'ENVIRONMENTAL',
  TECHNOLOGY = 'TECHNOLOGY',
}

export enum RiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum RiskStatus {
  IDENTIFIED = 'IDENTIFIED',
  ASSESSED = 'ASSESSED',
  MITIGATING = 'MITIGATING',
  MONITORING = 'MONITORING',
  CLOSED = 'CLOSED',
}

export interface IRisk extends Document {
  riskNumber: string;
  title: string;
  description: string;
  category: RiskCategory;
  probability: number;
  impact: number;
  riskScore: number;
  riskLevel: RiskLevel;
  status: RiskStatus;
  siteId?: Types.ObjectId;
  processId?: Types.ObjectId;
  ownerId: Types.ObjectId;
  identifiedById: Types.ObjectId;
  identifiedAt: Date;
  mitigationPlan?: string;
  contingencyPlan?: string;
  residualProbability?: number;
  residualImpact?: number;
  residualRiskScore?: number;
  residualRiskLevel?: RiskLevel;
  reviewDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RiskSchema = new Schema<IRisk>(
  {
    riskNumber: {
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
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: Object.values(RiskCategory),
      required: true,
    },
    probability: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    impact: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    riskScore: {
      type: Number,
    },
    riskLevel: {
      type: String,
      enum: Object.values(RiskLevel),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(RiskStatus),
      default: RiskStatus.IDENTIFIED,
    },
    siteId: {
      type: Schema.Types.ObjectId,
      ref: 'Site',
    },
    processId: {
      type: Schema.Types.ObjectId,
      ref: 'Process',
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    identifiedById: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    identifiedAt: {
      type: Date,
      default: Date.now,
    },
    mitigationPlan: {
      type: String,
      trim: true,
    },
    contingencyPlan: {
      type: String,
      trim: true,
    },
    residualProbability: {
      type: Number,
      min: 1,
      max: 5,
    },
    residualImpact: {
      type: Number,
      min: 1,
      max: 5,
    },
    residualRiskScore: {
      type: Number,
    },
    residualRiskLevel: {
      type: String,
      enum: Object.values(RiskLevel),
    },
    reviewDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

RiskSchema.index({ status: 1 });
RiskSchema.index({ riskLevel: 1 });
RiskSchema.index({ siteId: 1 });
RiskSchema.index({ processId: 1 });
RiskSchema.index({ ownerId: 1 });
RiskSchema.index({ identifiedById: 1 });

RiskSchema.virtual('calculatedRiskScore').get(function() {
  const doc = this as any;
  return doc.probability * doc.impact;
});

RiskSchema.pre('save', async function(next) {
  const doc = this as any;
  if (!doc.riskScore) {
    doc.riskScore = doc.probability * doc.impact;
  }

  const score = doc.riskScore || (doc.probability * doc.impact);
  if (score >= 20) {
    doc.riskLevel = 'CRITICAL';
  } else if (score >= 15) {
    doc.riskLevel = 'HIGH';
  } else if (score >= 8) {
    doc.riskLevel = 'MEDIUM';
  } else {
    doc.riskLevel = 'LOW';
  }

  if (doc.residualProbability && doc.residualImpact) {
    doc.residualRiskScore = doc.residualProbability * doc.residualImpact;
    const residualScore = doc.residualRiskScore;
    if (residualScore >= 20) {
      doc.residualRiskLevel = 'CRITICAL';
    } else if (residualScore >= 15) {
      doc.residualRiskLevel = 'HIGH';
    } else if (residualScore >= 8) {
      doc.residualRiskLevel = 'MEDIUM';
    } else {
      doc.residualRiskLevel = 'LOW';
    }
  }

  if (!doc.riskNumber) {
    const year = new Date().getFullYear();
    const count = await Risk.countDocuments({ riskNumber: new RegExp(`^RISK-${year}-`) });
    doc.riskNumber = `RISK-${year}-${String(count + 1).padStart(4, '0')}`;
  }

  next();
});

export const Risk = model<IRisk>('Risk', RiskSchema);
