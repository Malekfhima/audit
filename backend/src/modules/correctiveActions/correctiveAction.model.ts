import { Schema, model, Document, Types } from 'mongoose';

export enum ActionType {
  CORRECTIVE = 'CORRECTIVE',
  PREVENTIVE = 'PREVENTIVE',
  IMPROVEMENT = 'IMPROVEMENT',
}

export enum ActionStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  VERIFIED = 'VERIFIED',
  CANCELLED = 'CANCELLED',
}

export interface ICorrectiveAction extends Document {
  actionNumber: string;
  nonConformityId: Types.ObjectId;
  description: string;
  actionType: ActionType;
  status: ActionStatus;
  responsibleId: Types.ObjectId;
  dueDate: Date;
  completedDate?: Date;
  resources?: string;
  cost?: number;
  effectivenessCheck?: string;
  effectivenessVerifiedById?: Types.ObjectId;
  effectivenessVerifiedAt?: Date;
  attachments?: string[];
  createdById: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CorrectiveActionSchema = new Schema<ICorrectiveAction>(
  {
    actionNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    nonConformityId: {
      type: Schema.Types.ObjectId,
      ref: 'NonConformity',
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    actionType: {
      type: String,
      enum: Object.values(ActionType),
      required: true,
    },
    status: {
      type: String,
      enum: ['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED', 'CANCELLED'] as const,
      default: 'PLANNED' as any,
    },
    responsibleId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    completedDate: {
      type: Date,
    },
    resources: {
      type: String,
      trim: true,
    },
    cost: {
      type: Number,
    },
    effectivenessCheck: {
      type: String,
      trim: true,
    },
    effectivenessVerifiedById: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    effectivenessVerifiedAt: {
      type: Date,
    },
    attachments: {
      type: [String],
      default: [],
    },
    createdById: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

CorrectiveActionSchema.index({ nonConformityId: 1 });
CorrectiveActionSchema.index({ status: 1 });
CorrectiveActionSchema.index({ responsibleId: 1 });
CorrectiveActionSchema.index({ dueDate: 1 });

CorrectiveActionSchema.pre('save', async function(next) {
  const doc = this as any;
  if (!doc.actionNumber) {
    const year = new Date().getFullYear();
    const count = await CorrectiveAction.countDocuments({
      actionNumber: new RegExp(`^CA-${year}-`),
    });
    doc.actionNumber = `CA-${year}-${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

export const CorrectiveAction = model<ICorrectiveAction>('CorrectiveAction', CorrectiveActionSchema);
