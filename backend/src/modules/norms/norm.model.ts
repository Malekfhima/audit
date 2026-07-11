import { Schema, model, Document, Types } from 'mongoose';
import { NormClause, NormStatus } from './norm.types';

export interface INorm extends Document {
  name: string;
  code: string;
  description: string;
  version: string;
  status: NormStatus;
  category: string;
  clauses: NormClause[];
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NormSchema = new Schema<INorm>(
  {
    name: {
      type: String,
      required: [true, 'Norm name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Norm code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    version: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['ACTIVE', 'DRAFT', 'ARCHIVED'],
      default: 'ACTIVE',
    },
    category: {
      type: String,
      trim: true,
    },
    clauses: {
      type: [
        {
          number: String,
          title: String,
          description: String,
          requirements: [String],
        },
      ],
      default: [],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

NormSchema.index({ status: 1 });
NormSchema.index({ category: 1 });

export const Norm = model<INorm>('Norm', NormSchema);
