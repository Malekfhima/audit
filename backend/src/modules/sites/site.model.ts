import { Schema, model, Document, Types } from 'mongoose';

export interface ISite extends Document {
  name: string;
  code: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  siteManagerId: Types.ObjectId;
  contactEmail: string;
  contactPhone: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSchema = new Schema<ISite>(
  {
    name: {
      type: String,
      required: [true, 'Site name is required'],
      trim: true,
    },
    code: {
      type: String,
      required: [true, 'Site code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
    siteManagerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

SiteSchema.index({ isActive: 1 });
SiteSchema.index({ city: 1 });
SiteSchema.index({ country: 1 });

export const Site = model<ISite>('Site', SiteSchema);
