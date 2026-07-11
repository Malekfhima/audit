import { Schema, model, Document, Types } from 'mongoose';
import { ProcessCategory } from './process.types';

export interface IProcess extends Document {
  name: string;
  code: string;
  description: string;
  siteId: Types.ObjectId;
  processOwnerId: Types.ObjectId;
  category: ProcessCategory;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProcessSchema = new Schema<IProcess>(
  {
    name: {
      type: String,
      required: [true, 'Process name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Process code is required'],
      trim: true,
      uppercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    siteId: {
      type: Schema.Types.ObjectId,
      ref: 'Site',
      required: true,
    },
    processOwnerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    category: {
      type: String,
      enum: ['PRODUCTION', 'QUALITY', 'MAINTENANCE', 'LOGISTICS', 'ADMINISTRATION', 'OTHER'],
      default: 'OTHER',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

ProcessSchema.index({ siteId: 1, code: 1 }, { unique: true });
ProcessSchema.index({ siteId: 1 });
ProcessSchema.index({ category: 1 });

export const Process = model<IProcess>('Process', ProcessSchema);
