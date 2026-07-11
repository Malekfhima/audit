import AuditEntryModel from './auditEntry.model';
import { Audit } from '../audits/audit.model';
import { NotFoundError, ForbiddenError, BadRequestError } from '../../core/http/httpError';
import { CreateAuditEntryDto, UpdateAuditEntryDto } from './auditEntry.types';

class AuditEntryService {
  async createAuditEntry(dto: CreateAuditEntryDto) {
    const audit = await Audit.findById(dto.auditId);
    if (!audit) throw new NotFoundError('Audit not found');
    if (!['IN_PROGRESS', 'COMPLETED'].includes(audit.status))
      throw new ForbiddenError('Audit is not in a valid state for adding entries');

    const entry = await AuditEntryModel.create({
      ...dto,
      verifiedById: dto.verifiedById,
      verifiedAt: dto.verifiedById ? new Date() : undefined,
    });
    return entry;
  }

  async createBulkEntries(entries: CreateAuditEntryDto[]) {
    const created = await AuditEntryModel.insertMany(entries);
    return created;
  }

  async getEntryById(id: string) {
    const entry = await AuditEntryModel.findById(id)
      .populate('auditId')
      .populate('clauseId')
      .populate('verifiedById')
      .populate('nonConformityId');
    if (!entry) throw new NotFoundError('Audit entry not found');
    return entry;
  }

  async updateEntry(id: string, dto: UpdateAuditEntryDto) {
    const entry = await AuditEntryModel.findById(id);
    if (!entry) throw new NotFoundError('Audit entry not found');

    if (dto.verifiedById && !entry.verifiedAt) {
      dto.verifiedAt = new Date() as any;
    }

    const updated = await AuditEntryModel.findByIdAndUpdate(id, dto, { new: true });
    return updated;
  }

  async deleteEntry(id: string) {
    const entry = await AuditEntryModel.findByIdAndDelete(id);
    if (!entry) throw new NotFoundError('Audit entry not found');
    return { success: true };
  }

  async getEntriesByAudit(auditId: string, filters?: { conformityStatus?: string }) {
    const query: any = { auditId };
    if (filters?.conformityStatus) query.conformityStatus = filters.conformityStatus;

    const entries = await AuditEntryModel.find(query)
      .populate('auditId')
      .populate('clauseId')
      .populate('verifiedById')
      .populate('nonConformityId');
    return entries;
  }

  async verifyEntry(id: string, userId: string) {
    const entry = await AuditEntryModel.findById(id);
    if (!entry) throw new NotFoundError('Audit entry not found');

    entry.verifiedById = userId as any;
    entry.verifiedAt = new Date();
    await entry.save();
    return entry;
  }

  async markAsVerified(id: string, verifiedById: string) {
    const entry = await AuditEntryModel.findById(id);
    if (!entry) throw new NotFoundError('Audit entry not found');

    entry.verifiedById = verifiedById as any;
    entry.verifiedAt = new Date();
    await entry.save();
    return entry;
  }

  async addEvidence(id: string, evidence: string, attachments?: string[]) {
    const entry = await AuditEntryModel.findById(id);
    if (!entry) throw new NotFoundError('Audit entry not found');

    entry.evidence = evidence;
    if (attachments) entry.attachments = [...(entry.attachments || []), ...attachments];
    await entry.save();
    return entry;
  }

  async getAuditStatistics(auditId: string) {
    const entries = await AuditEntryModel.find({ auditId });
    const total = entries.length;
    const stats: Record<string, number> = {
      CONFORM: 0,
      NON_CONFORM: 0,
      NOT_APPLICABLE: 0,
      OBSERVATION: 0,
      OPPORTUNITY: 0,
    };

    entries.forEach((e) => {
      stats[e.conformityStatus] = (stats[e.conformityStatus] || 0) + 1;
    });

    const percentages = Object.fromEntries(
      Object.entries(stats).map(([k, v]) => [k, total ? (v / total) * 100 : 0])
    );

    return { total, counts: stats, percentages };
  }

  async getConformityStatistics(auditId: string) {
    return this.getAuditStatistics(auditId);
  }
}

export default new AuditEntryService();
