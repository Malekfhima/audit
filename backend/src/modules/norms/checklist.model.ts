// ==============================================
// MODULE: NORMS - CHECKLIST TEMPLATE MODEL
// ==============================================
// Schema for audit checklist templates based on norms

import { Schema, model, Document, Types } from 'mongoose';

export interface IChecklistItem {
  clauseId: Types.ObjectId;
  question: string;
  category: string;
  order: number;
  isRequired: boolean;
}

export interface IChecklist extends Document {
  name: string;
  normId: Types.ObjectId;
  items: IChecklistItem[];
  isDefault: boolean;
  version: string;
  createdBy: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ChecklistItemSchema = new Schema<IChecklistItem>(
  {
    clauseId: {
      type: Schema.Types.ObjectId,
      ref: 'Clause',
      required: true,
    },
    question: {
      type: String,
      required: [true, 'Question is required'],
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isRequired: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const ChecklistSchema = new Schema<IChecklist>(
  {
    name: {
      type: String,
      required: [true, 'Checklist name is required'],
      trim: true,
    },
    normId: {
      type: Schema.Types.ObjectId,
      ref: 'Norm',
      required: [true, 'Norm ID is required'],
    },
    items: {
      type: [ChecklistItemSchema],
      default: [],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
    version: {
      type: String,
      trim: true,
    },
    createdBy: {
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

ChecklistSchema.index({ normId: 1 });
ChecklistSchema.index({ isDefault: 1 });
ChecklistSchema.index({ createdBy: 1 });

export const Checklist = model<IChecklist>('Checklist', ChecklistSchema);
