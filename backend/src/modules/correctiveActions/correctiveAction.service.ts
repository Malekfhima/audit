import { correctiveActionRepository } from './correctiveAction.repository';
import { CreateCorrectiveActionDto, UpdateCorrectiveActionDto, CorrectiveActionFilters } from './correctiveAction.types';
import { NotFoundError, BadRequestError } from '../../core/http/httpError';
import { PaginationParams, createPaginationResult } from '../../core/utils/pagination';
import { ICorrectiveAction } from './correctiveAction.model';
import { NonConformity } from '../nonConformities/nonConformity.model';
import { User } from '../users/user.model';

class CorrectiveActionService {
  async createAction(dto: CreateCorrectiveActionDto): Promise<ICorrectiveAction> {
    const nc = await NonConformity.findById(dto.nonConformityId);
    if (!nc) throw new NotFoundError('Non-conformity not found');

    const user = await User.findById(dto.responsibleId);
    if (!user) throw new NotFoundError('Responsible user not found');

    const creator = await User.findById(dto.createdById);
    if (!creator) throw new NotFoundError('Creator user not found');

    const action = await correctiveActionRepository.create(dto);
    return action;
  }

  async getAction(id: string): Promise<ICorrectiveAction> {
    const action = await correctiveActionRepository.findById(id);
    if (!action) throw new NotFoundError('Corrective action not found');
    return action;
  }

  async updateAction(id: string, dto: UpdateCorrectiveActionDto): Promise<ICorrectiveAction> {
    const action = await correctiveActionRepository.findById(id);
    if (!action) throw new NotFoundError('Corrective action not found');

    if (dto.responsibleId) {
      const user = await User.findById(dto.responsibleId);
      if (!user) throw new NotFoundError('Responsible user not found');
    }

    const updated = await correctiveActionRepository.update(id, dto);
    if (!updated) throw new NotFoundError('Corrective action not found');
    return updated;
  }

  async deleteAction(id: string): Promise<void> {
    const action = await correctiveActionRepository.findById(id);
    if (!action) throw new NotFoundError('Corrective action not found');

    if (action.status === 'COMPLETED' || action.status === 'VERIFIED') {
      throw new BadRequestError('Cannot delete completed or verified actions');
    }

    await correctiveActionRepository.delete(id);
  }

  async getAllActions(filters: CorrectiveActionFilters, pagination: PaginationParams) {
    const actions = await correctiveActionRepository.find(filters, pagination);
    const total = await correctiveActionRepository.count(filters);
    return createPaginationResult(actions, total, pagination);
  }

  async getActionsByNC(nonConformityId: string): Promise<ICorrectiveAction[]> {
    const nc = await NonConformity.findById(nonConformityId);
    if (!nc) throw new NotFoundError('Non-conformity not found');

    return await correctiveActionRepository.findByNCId(nonConformityId);
  }

  async updateStatus(id: string, status: string): Promise<ICorrectiveAction> {
    const action = await correctiveActionRepository.findById(id);
    if (!action) throw new NotFoundError('Corrective action not found');

    const validTransitions: Record<string, string[]> = {
      PLANNED: ['IN_PROGRESS', 'CANCELLED'],
      IN_PROGRESS: ['COMPLETED', 'PLANNED', 'CANCELLED'],
      COMPLETED: ['VERIFIED', 'IN_PROGRESS'],
      VERIFIED: [],
      CANCELLED: ['PLANNED'],
    };

    if (!validTransitions[action.status]?.includes(status)) {
      throw new BadRequestError(`Invalid status transition from ${action.status} to ${status}`);
    }

    const updated = await correctiveActionRepository.updateStatus(id, status);
    if (!updated) throw new NotFoundError('Corrective action not found');
    return updated;
  }

  async markAsCompleted(id: string, completedDate: Date): Promise<ICorrectiveAction> {
    const action = await correctiveActionRepository.findById(id);
    if (!action) throw new NotFoundError('Corrective action not found');

    if (action.status !== 'IN_PROGRESS') {
      throw new BadRequestError('Can only mark in-progress actions as completed');
    }

    const updated = await correctiveActionRepository.markAsCompleted(id, completedDate);
    if (!updated) throw new NotFoundError('Corrective action not found');
    return updated;
  }

  async verifyEffectiveness(id: string, verifiedById: string, effectivenessCheck: string, isEffective: boolean): Promise<ICorrectiveAction> {
    const action = await correctiveActionRepository.findById(id);
    if (!action) throw new NotFoundError('Corrective action not found');

    if (action.status !== 'COMPLETED') {
      throw new BadRequestError('Can only verify completed actions');
    }

    const user = await User.findById(verifiedById);
    if (!user) throw new NotFoundError('Verifier user not found');

    if (!isEffective) {
      await correctiveActionRepository.update(id, {
        status: 'IN_PROGRESS' as any,
        effectivenessCheck: `${effectivenessCheck}\n\nAction marked as ineffective. Needs rework.`,
      });
    }

    const updated = await correctiveActionRepository.verifyEffectiveness(id, effectivenessCheck, verifiedById);
    if (!updated) throw new NotFoundError('Corrective action not found');
    return updated;
  }

  async markAsIneffective(id: string, reason: string): Promise<ICorrectiveAction> {
    const action = await correctiveActionRepository.findById(id);
    if (!action) throw new NotFoundError('Corrective action not found');

    if (action.status !== 'VERIFIED' && action.status !== 'COMPLETED') {
      throw new BadRequestError('Can only mark verified or completed actions as ineffective');
    }

    const updated = await correctiveActionRepository.update(id, {
      status: 'IN_PROGRESS' as any,
      effectivenessCheck: `${action.effectivenessCheck || ''}\n\nMarked ineffective: ${reason}`,
      effectivenessVerifiedAt: undefined,
      effectivenessVerifiedById: undefined,
    });
    if (!updated) throw new NotFoundError('Corrective action not found');
    return updated;
  }

  async getOverdueActions(): Promise<ICorrectiveAction[]> {
    return await correctiveActionRepository.getOverdueActions();
  }

  async getActionsStatistics() {
    const planned = await correctiveActionRepository.count({ status: 'PLANNED' as any });
    const inProgress = await correctiveActionRepository.count({ status: 'IN_PROGRESS' as any });
    const completed = await correctiveActionRepository.count({ status: 'COMPLETED' as any });
    const verified = await correctiveActionRepository.count({ status: 'VERIFIED' as any });
    const corrective = await correctiveActionRepository.count({ actionType: 'CORRECTIVE' as any });
    const preventive = await correctiveActionRepository.count({ actionType: 'PREVENTIVE' as any });
    const improvement = await correctiveActionRepository.count({ actionType: 'IMPROVEMENT' as any });

    return {
      byStatus: { planned, inProgress, completed, verified },
      byType: { corrective, preventive, improvement },
      total: planned + inProgress + completed + verified,
    };
  }

  async getActionsByResponsible(responsibleId: string): Promise<ICorrectiveAction[]> {
    return await correctiveActionRepository.getActionsByResponsible(responsibleId);
  }
}

export const correctiveActionService = new CorrectiveActionService();
