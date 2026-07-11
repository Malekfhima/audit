import { nonConformityRepository } from './nonConformity.repository';
import { CreateNonConformityDto, UpdateNonConformityDto, NonConformityFilters } from './nonConformity.types';
import { NotFoundError, BadRequestError } from '../../core/http/httpError';
import { PaginationParams, createPaginationResult } from '../../core/utils/pagination';
import { INonConformity } from './nonConformity.model';
import { Audit } from '../audits/audit.model';
import { User } from '../users/user.model';

class NonConformityService {
  async createNC(dto: CreateNonConformityDto): Promise<INonConformity> {
    const audit = await Audit.findById(dto.auditId);
    if (!audit) throw new NotFoundError('Audit not found');

    if (dto.assignedToId) {
      const user = await User.findById(dto.assignedToId);
      if (!user) throw new NotFoundError('Assigned user not found');
    }

    const user = await User.findById(dto.detectedById);
    if (!user) throw new NotFoundError('Detector user not found');

    const nc = await nonConformityRepository.create(dto);
    return nc;
  }

  async getNC(id: string): Promise<INonConformity> {
    const nc = await nonConformityRepository.findById(id);
    if (!nc) throw new NotFoundError('Non-conformity not found');
    return nc;
  }

  async updateNC(id: string, dto: UpdateNonConformityDto): Promise<INonConformity> {
    const nc = await nonConformityRepository.findById(id);
    if (!nc) throw new NotFoundError('Non-conformity not found');

    if (dto.assignedToId) {
      const user = await User.findById(dto.assignedToId);
      if (!user) throw new NotFoundError('Assigned user not found');
    }

    const updated = await nonConformityRepository.update(id, dto);
    if (!updated) throw new NotFoundError('Non-conformity not found');
    return updated;
  }

  async deleteNC(id: string): Promise<void> {
    const nc = await nonConformityRepository.findById(id);
    if (!nc) throw new NotFoundError('Non-conformity not found');

    if (nc.status === 'CLOSED' || nc.status === 'RESOLVED') {
      throw new BadRequestError('Cannot delete closed or resolved non-conformities');
    }

    await nonConformityRepository.delete(id);
  }

  async getAllNCs(filters: NonConformityFilters, pagination: PaginationParams) {
    const ncs = await nonConformityRepository.find(filters, pagination);
    const total = await nonConformityRepository.count(filters);
    return createPaginationResult(ncs, total, pagination);
  }

  async assignNC(id: string, assignedToId: string, targetClosureDate?: Date): Promise<INonConformity> {
    const nc = await nonConformityRepository.findById(id);
    if (!nc) throw new NotFoundError('Non-conformity not found');

    const user = await User.findById(assignedToId);
    if (!user) throw new NotFoundError('Assigned user not found');

    const updated = await nonConformityRepository.update(id, {
      assignedToId,
      status: 'IN_PROGRESS' as any,
      targetClosureDate,
    });
    if (!updated) throw new NotFoundError('Non-conformity not found');
    return updated;
  }

  async updateStatus(id: string, status: string): Promise<INonConformity> {
    const nc = await nonConformityRepository.findById(id);
    if (!nc) throw new NotFoundError('Non-conformity not found');

    const validTransitions: Record<string, string[]> = {
      OPEN: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['RESOLVED', 'OPEN', 'CANCELLED'],
      RESOLVED: ['CLOSED', 'IN_PROGRESS'],
      CLOSED: [],
      CANCELLED: ['OPEN'],
    };

    if (!validTransitions[nc.status]?.includes(status)) {
      throw new BadRequestError(`Invalid status transition from ${nc.status} to ${status}`);
    }

    const updated = await nonConformityRepository.updateStatus(id, status);
    if (!updated) throw new NotFoundError('Non-conformity not found');
    return updated;
  }

  async addRootCause(id: string, rootCause: string): Promise<INonConformity> {
    const nc = await nonConformityRepository.findById(id);
    if (!nc) throw new NotFoundError('Non-conformity not found');

    const updated = await nonConformityRepository.addRootCause(id, rootCause);
    if (!updated) throw new NotFoundError('Non-conformity not found');
    return updated;
  }

  async addImmediateAction(id: string, immediateAction: string): Promise<INonConformity> {
    const nc = await nonConformityRepository.findById(id);
    if (!nc) throw new NotFoundError('Non-conformity not found');

    const updated = await nonConformityRepository.addImmediateAction(id, immediateAction);
    if (!updated) throw new NotFoundError('Non-conformity not found');
    return updated;
  }

  async closeNC(id: string, actualClosureDate: Date): Promise<INonConformity> {
    const nc = await nonConformityRepository.findById(id);
    if (!nc) throw new NotFoundError('Non-conformity not found');

    if (nc.status !== 'RESOLVED') {
      throw new BadRequestError('Can only close resolved non-conformities');
    }

    const updated = await nonConformityRepository.update(id, {
      status: 'CLOSED' as any,
      actualClosureDate,
    });
    if (!updated) throw new NotFoundError('Non-conformity not found');
    return updated;
  }

  async verifyNC(id: string, verifiedById: string): Promise<INonConformity> {
    const nc = await nonConformityRepository.findById(id);
    if (!nc) throw new NotFoundError('Non-conformity not found');

    if (nc.status !== 'CLOSED') {
      throw new BadRequestError('Can only verify closed non-conformities');
    }

    const user = await User.findById(verifiedById);
    if (!user) throw new NotFoundError('Verifier user not found');

    const updated = await nonConformityRepository.markAsVerified(id, verifiedById);
    if (!updated) throw new NotFoundError('Non-conformity not found');
    return updated;
  }

  async reopenNC(id: string, reason: string): Promise<INonConformity> {
    const nc = await nonConformityRepository.findById(id);
    if (!nc) throw new NotFoundError('Non-conformity not found');

    if (nc.status !== 'CLOSED' && nc.status !== 'RESOLVED') {
      throw new BadRequestError('Can only reopen closed or resolved non-conformities');
    }

    const updated = await nonConformityRepository.update(id, {
      status: 'OPEN' as any,
      rootCause: `${nc.rootCause || ''}\n\nReopened reason: ${reason}`,
      actualClosureDate: undefined,
      verifiedAt: undefined,
    });
    if (!updated) throw new NotFoundError('Non-conformity not found');
    return updated;
  }

  async getNCStatistics() {
    const open = await nonConformityRepository.count({ status: 'OPEN' as any });
    const inProgress = await nonConformityRepository.count({ status: 'IN_PROGRESS' as any });
    const resolved = await nonConformityRepository.count({ status: 'RESOLVED' as any });
    const closed = await nonConformityRepository.count({ status: 'CLOSED' as any });
    const critical = await nonConformityRepository.count({ severity: 'CRITICAL' as any });
    const major = await nonConformityRepository.count({ severity: 'MAJOR' as any });
    const minor = await nonConformityRepository.count({ severity: 'MINOR' as any });

    return {
      byStatus: { open, inProgress, resolved, closed },
      bySeverity: { critical, major, minor },
      total: open + inProgress + resolved + closed,
    };
  }

  async getNCsByAudit(auditId: string): Promise<INonConformity[]> {
    return await nonConformityRepository.getNCsByAudit(auditId);
  }

  async getNCsByAssignedTo(assignedToId: string): Promise<INonConformity[]> {
    return await nonConformityRepository.getNCsByAssignedTo(assignedToId);
  }

  async getOpenNCs(): Promise<INonConformity[]> {
    return await nonConformityRepository.getOpenNCs();
  }
}

export const nonConformityService = new NonConformityService();
