import { ActionType, ActionStatus } from './correctiveAction.model';

export interface CreateCorrectiveActionDto {
  nonConformityId: string;
  description: string;
  actionType: ActionType;
  responsibleId: string;
  dueDate: Date;
  resources?: string;
  cost?: number;
  attachments?: string[];
  createdById: string;
}

export interface UpdateCorrectiveActionDto {
  description?: string;
  actionType?: ActionType;
  status?: ActionStatus;
  responsibleId?: string;
  dueDate?: Date;
  completedDate?: Date;
  resources?: string;
  cost?: number;
  effectivenessCheck?: string;
  effectivenessVerifiedById?: string;
  effectivenessVerifiedAt?: Date;
  attachments?: string[];
}

export interface CorrectiveActionResponse {
  id: string;
  actionNumber: string;
  nonConformityId: string;
  description: string;
  actionType: ActionType;
  status: ActionStatus;
  responsibleId: string;
  dueDate: Date;
  completedDate?: Date;
  resources?: string;
  cost?: number;
  effectivenessCheck?: string;
  effectivenessVerifiedById?: string;
  effectivenessVerifiedAt?: Date;
  attachments?: string[];
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CorrectiveActionFilters {
  status?: ActionStatus;
  actionType?: ActionType;
  nonConformityId?: string;
  responsibleId?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
}
