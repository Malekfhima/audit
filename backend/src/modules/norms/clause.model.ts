// ==============================================
// MODULE: NORMS - CLAUSE MODEL
// ==============================================
// Schema for norm clauses (sections within a norm)

import { Schema, model, Document, Types } from 'mongoose';

export interface IClause extends Document {
  normId: Types.ObjectId;
  clauseNumber: string;
  title: string;
  description: string;
  requirements: string[];
  parentClauseId?: Types.ObjectId;
  level: number;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClauseSchema = new Schema<IClause>(
  {
    normId: {
      type: Schema.Types.ObjectId,
      ref: 'Norm',
      required: [true, 'Norm ID is required'],
    },
    clauseNumber: {
      type: String,
      required: [true, 'Clause number is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Clause title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    requirements: {
      type: [String],
      default: [],
    },
    parentClauseId: {
      type: Schema.Types.ObjectId,
      ref: 'Clause',
    },
    level: {
      type: Number,
      default: 1,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Compound unique index for normId + clauseNumber
ClauseSchema.index({ normId: 1, clauseNumber: 1 }, { unique: true });
ClauseSchema.index({ normId: 1 });
ClauseSchema.index({ parentClauseId: 1 });
ClauseSchema.index({ level: 1 });

export const Clause = model<IClause>('Clause', ClauseSchema);
