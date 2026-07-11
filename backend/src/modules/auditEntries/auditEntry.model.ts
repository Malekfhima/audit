import mongoose, { Schema, Document, Types } from 'mongoose';

// ==============================================
// ENUM: Conformity Status
// ==============================================
export enum ConformityStatus {
  CONFORM = 'CONFORM',
  NON_CONFORM = 'NON_CONFORM',
  NOT_APPLICABLE = 'NOT_APPLICABLE',
  OBSERVATION = 'OBSERVATION',
  OPPORTUNITY = 'OPPORTUNITY',
}

// ==============================================
// INTERFACE: Audit Entry Document
// ==============================================
export interface IAuditEntry extends Document {
  auditId: Types.ObjectId;
  clauseId: Types.ObjectId;
  question: string;
  evidence?: string;
  finding?: string;
  conformityStatus: ConformityStatus;
  attachments?: string[];
  verifiedById?: Types.ObjectId;
  verifiedAt?: Date;
  nonConformityId?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

// ==============================================
// SCHEMA
// ==============================================
const AuditEntrySchema: Schema<IAuditEntry> = new Schema(
  {
    auditId: { type: Schema.Types.ObjectId, ref: 'Audit', required: true },
    clauseId: { type: Schema.Types.ObjectId, ref: 'Clause', required: true },
    question: { type: String, required: true },
    evidence: { type: String },
    finding: { type: String },
    conformityStatus: {
      type: String,
      enum: Object.values(ConformityStatus),
      required: true,
    },
    attachments: [{ type: String }],
    verifiedById: { type: Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: { type: Date },
    nonConformityId: { type: Schema.Types.ObjectId, ref: 'NonConformity' },
  },
  { timestamps: true }
);

// ==============================================
// INDEXES
// ==============================================
AuditEntrySchema.index({ auditId: 1, clauseId: 1 }, { unique: true });
AuditEntrySchema.index({ auditId: 1 });
AuditEntrySchema.index({ conformityStatus: 1 });

// ==============================================
// MODEL EXPORT
// ==============================================
const AuditEntryModel = mongoose.model<IAuditEntry>('AuditEntry', AuditEntrySchema);
export default AuditEntryModel;
