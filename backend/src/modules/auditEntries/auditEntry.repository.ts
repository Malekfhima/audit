import AuditEntryModel, { IAuditEntry, ConformityStatus } from './auditEntry.model';
import { Types } from 'mongoose';

export class AuditEntryRepository {
  // ==============================================
  // CREATE SINGLE ENTRY
  // ==============================================
  async create(entryData: Partial<IAuditEntry>): Promise<IAuditEntry> {
    const entry = new AuditEntryModel(entryData);
    return entry.save();
  }

  // ==============================================
  // BULK CREATE (for checklist)
  // ==============================================
  async bulkCreate(entries: Partial<IAuditEntry>[]): Promise<IAuditEntry[]> {
    return AuditEntryModel.insertMany(entries, { ordered: true });
  }

  // ==============================================
  // FIND BY ID
  // ==============================================
  async findById(id: string, populate: string[] = []): Promise<IAuditEntry | null> {
    let query = AuditEntryModel.findById(id);
    populate.forEach((field) => query = query.populate(field));
    return query.exec();
  }

  // ==============================================
  // UPDATE ENTRY
  // ==============================================
  async update(id: string, updateData: Partial<IAuditEntry>): Promise<IAuditEntry | null> {
    return AuditEntryModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  // ==============================================
  // DELETE ENTRY
  // ==============================================
  async delete(id: string): Promise<IAuditEntry | null> {
    return AuditEntryModel.findByIdAndDelete(id).exec();
  }

  // ==============================================
  // FIND ALL ENTRIES BY AUDIT ID
  // ==============================================
  async findByAuditId(
    auditId: string,
    populate: string[] = []
  ): Promise<IAuditEntry[]> {
    let query = AuditEntryModel.find({ auditId: new Types.ObjectId(auditId) });
    populate.forEach((field) => query = query.populate(field));
    return query.exec();
  }

  // ==============================================
  // FIND BY CLAUSE ID
  // ==============================================
  async findByClauseId(clauseId: string): Promise<IAuditEntry[]> {
    return AuditEntryModel.find({ clauseId: new Types.ObjectId(clauseId) }).exec();
  }

  // ==============================================
  // FIND BY CONFORMITY STATUS
  // ==============================================
  async findByConformityStatus(status: ConformityStatus): Promise<IAuditEntry[]> {
    return AuditEntryModel.find({ conformityStatus: status }).exec();
  }

  // ==============================================
  // COUNT ENTRIES BY AUDIT ID
  // ==============================================
  async countByAuditId(auditId: string): Promise<number> {
    return AuditEntryModel.countDocuments({ auditId: new Types.ObjectId(auditId) }).exec();
  }

  // ==============================================
  // COUNT ENTRIES BY STATUS (for statistics)
  // ==============================================
  async countByStatus(auditId: string, status: ConformityStatus): Promise<number> {
    return AuditEntryModel.countDocuments({
      auditId: new Types.ObjectId(auditId),
      conformityStatus: status,
    }).exec();
  }
}
