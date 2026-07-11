import { auditRepository } from './audit.repository';
import { CreateAuditDto, UpdateAuditDto, AuditFilters } from './audit.types';
import { NotFoundError, ConflictError, BadRequestError } from '../../core/http/httpError';
import { PaginationParams, createPaginationResult } from '../../core/utils/pagination';
import { IAudit } from './audit.model';
import { Norm } from '../norms/norm.model';
import { Site } from '../sites/site.model';
import { Process } from '../processes/process.model';
import { User } from '../users/user.model';

class AuditService {
  async createAudit(dto: CreateAuditDto, userId: string): Promise<IAudit> {
    const norm = await Norm.findById(dto.normId);
    if (!norm) throw new NotFoundError('Norm not found');

    const site = await Site.findById(dto.siteId);
    if (!site) throw new NotFoundError('Site not found');

    if (dto.processIds && dto.processIds.length > 0) {
      for (const processId of dto.processIds) {
        const process = await Process.findById(processId);
        if (!process) throw new NotFoundError(`Process ${processId} not found`);
      }
    }

    const leadAuditor = await User.findById(dto.leadAuditorId);
    if (!leadAuditor) throw new NotFoundError('Lead auditor not found');

    if (dto.auditorIds && dto.auditorIds.length > 0) {
      for (const auditorId of dto.auditorIds) {
        const auditor = await User.findById(auditorId);
        if (!auditor) throw new NotFoundError(`Auditor ${auditorId} not found`);
      }
    }

    const audit = await auditRepository.create({ ...dto, createdBy: userId as any });
    return audit;
  }

  async getAudit(id: string): Promise<IAudit> {
    const audit = await auditRepository.findById(id);
    if (!audit) throw new NotFoundError('Audit not found');
    return audit;
  }

  async updateAudit(id: string, dto: UpdateAuditDto): Promise<IAudit> {
    const audit = await auditRepository.findById(id);
    if (!audit) throw new NotFoundError('Audit not found');

    if (audit.status !== 'PLANNED') {
      throw new BadRequestError('Can only update audits in PLANNED status');
    }

    if (dto.normId) {
      const norm = await Norm.findById(dto.normId);
      if (!norm) throw new NotFoundError('Norm not found');
    }

    if (dto.siteId) {
      const site = await Site.findById(dto.siteId);
      if (!site) throw new NotFoundError('Site not found');
    }

    if (dto.leadAuditorId) {
      const leadAuditor = await User.findById(dto.leadAuditorId);
      if (!leadAuditor) throw new NotFoundError('Lead auditor not found');
    }

    const updated = await auditRepository.update(id, dto);
    if (!updated) throw new NotFoundError('Audit not found');
    return updated;
  }

  async deleteAudit(id: string): Promise<void> {
    const audit = await auditRepository.findById(id);
    if (!audit) throw new NotFoundError('Audit not found');

    if (audit.status !== 'PLANNED') {
      throw new BadRequestError('Can only delete audits in PLANNED status');
    }

    await auditRepository.delete(id);
  }

  async getAllAudits(filters: AuditFilters, pagination: PaginationParams) {
    const audits = await auditRepository.find(filters, pagination);
    const total = await auditRepository.count(filters);
    return createPaginationResult(audits, total, pagination);
  }

  async startAudit(id: string): Promise<IAudit> {
    const audit = await auditRepository.findById(id);
    if (!audit) throw new NotFoundError('Audit not found');

    if (audit.status !== 'PLANNED') {
      throw new BadRequestError('Can only start audits in PLANNED status');
    }

    const updated = await auditRepository.update(id, {
      status: 'IN_PROGRESS',
      actualStartDate: new Date(),
    });
    if (!updated) throw new NotFoundError('Audit not found');
    return updated;
  }

  async completeAudit(id: string): Promise<IAudit> {
    const audit = await auditRepository.findById(id);
    if (!audit) throw new NotFoundError('Audit not found');

    if (audit.status !== 'IN_PROGRESS') {
      throw new BadRequestError('Can only complete audits in IN_PROGRESS status');
    }

    const updated = await auditRepository.update(id, {
      status: 'COMPLETED',
      actualEndDate: new Date(),
    });
    if (!updated) throw new NotFoundError('Audit not found');
    return updated;
  }

  async cancelAudit(id: string): Promise<IAudit> {
    const audit = await auditRepository.findById(id);
    if (!audit) throw new NotFoundError('Audit not found');

    if (audit.status === 'COMPLETED') {
      throw new BadRequestError('Cannot cancel completed audits');
    }

    const updated = await auditRepository.update(id, { status: 'CANCELLED' });
    if (!updated) throw new NotFoundError('Audit not found');
    return updated;
  }

  async calculateConformityScore(id: string): Promise<IAudit> {
    const audit = await auditRepository.findById(id);
    if (!audit) throw new NotFoundError('Audit not found');

    const score = await this.calculateScoreFromEntries(id);
    const updated = await auditRepository.updateConformityScore(id, score);
    if (!updated) throw new NotFoundError('Audit not found');
    return updated;
  }

  async addSummary(id: string, summary: string, conclusions: string, recommendations: string): Promise<IAudit> {
    const audit = await auditRepository.findById(id);
    if (!audit) throw new NotFoundError('Audit not found');

    const updated = await auditRepository.update(id, { summary, conclusions, recommendations });
    if (!updated) throw new NotFoundError('Audit not found');
    return updated;
  }

  async assignAuditors(id: string, auditorIds: string[]): Promise<IAudit> {
    const audit = await auditRepository.findById(id);
    if (!audit) throw new NotFoundError('Audit not found');

    for (const auditorId of auditorIds) {
      const auditor = await User.findById(auditorId);
      if (!auditor) throw new NotFoundError(`Auditor ${auditorId} not found`);
    }

    const updated = await auditRepository.update(id, { auditorIds });
    if (!updated) throw new NotFoundError('Audit not found');
    return updated;
  }

  async assignAuditees(id: string, auditeeIds: string[]): Promise<IAudit> {
    const audit = await auditRepository.findById(id);
    if (!audit) throw new NotFoundError('Audit not found');

    for (const auditeeId of auditeeIds) {
      const auditee = await User.findById(auditeeId);
      if (!auditee) throw new NotFoundError(`Auditee ${auditeeId} not found`);
    }

    const updated = await auditRepository.update(id, { auditeeIds });
    if (!updated) throw new NotFoundError('Audit not found');
    return updated;
  }

  async getUpcomingAudits(): Promise<IAudit[]> {
    return await auditRepository.getUpcomingAudits();
  }

  async getActiveAudits(): Promise<IAudit[]> {
    return await auditRepository.getActiveAudits();
  }

  async getCompletedAudits(): Promise<IAudit[]> {
    return await auditRepository.getCompletedAudits();
  }

  private async calculateScoreFromEntries(auditId: string): Promise<number> {
    return 0;
  }
}

export const auditService = new AuditService();
