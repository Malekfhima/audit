import { CorrectiveAction, ICorrectiveAction } from './correctiveAction.model';
import { CreateCorrectiveActionDto, UpdateCorrectiveActionDto, CorrectiveActionFilters } from './correctiveAction.types';
import { PaginationParams, getPaginationOptions } from '../../core/utils/pagination';

class CorrectiveActionRepository {
  async create(data: CreateCorrectiveActionDto): Promise<ICorrectiveAction> {
    const action = await CorrectiveAction.create(data);
    return action;
  }

  async findById(id: string): Promise<ICorrectiveAction | null> {
    return await CorrectiveAction.findById(id)
      .populate('nonConformityId')
      .populate('responsibleId', 'firstName lastName email')
      .populate('createdById', 'firstName lastName email')
      .populate('effectivenessVerifiedById', 'firstName lastName email');
  }

  async findByActionNumber(actionNumber: string): Promise<ICorrectiveAction | null> {
    return await CorrectiveAction.findOne({ actionNumber: actionNumber.toUpperCase() });
  }

  async update(id: string, data: UpdateCorrectiveActionDto): Promise<ICorrectiveAction | null> {
    return await CorrectiveAction.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('nonConformityId')
      .populate('responsibleId', 'firstName lastName email');
  }

  async delete(id: string): Promise<boolean> {
    const result = await CorrectiveAction.findByIdAndDelete(id);
    return !!result;
  }

  async findByNCId(nonConformityId: string): Promise<ICorrectiveAction[]> {
    return await CorrectiveAction.find({ nonConformityId })
      .populate('responsibleId', 'firstName lastName email')
      .sort({ dueDate: 1 });
  }

  async find(filters: CorrectiveActionFilters, pagination: PaginationParams): Promise<ICorrectiveAction[]> {
    const { skip, limit, sort } = getPaginationOptions(pagination);
    const query = this.buildQuery(filters);

    return await CorrectiveAction.find(query)
      .populate('nonConformityId')
      .populate('responsibleId', 'firstName lastName email')
      .skip(skip)
      .limit(limit)
      .sort(sort);
  }

  async count(filters: CorrectiveActionFilters): Promise<number> {
    const query = this.buildQuery(filters);
    return await CorrectiveAction.countDocuments(query);
  }

  async updateStatus(id: string, status: string): Promise<ICorrectiveAction | null> {
    return await CorrectiveAction.findByIdAndUpdate(id, { status }, { new: true });
  }

  async markAsCompleted(id: string, completedDate: Date): Promise<ICorrectiveAction | null> {
    return await CorrectiveAction.findByIdAndUpdate(
      id,
      { status: 'COMPLETED', completedDate },
      { new: true }
    );
  }

  async verifyEffectiveness(id: string, effectivenessCheck: string, verifiedById: string): Promise<ICorrectiveAction | null> {
    return await CorrectiveAction.findByIdAndUpdate(
      id,
      {
        effectivenessCheck,
        effectivenessVerifiedById: verifiedById,
        effectivenessVerifiedAt: new Date(),
        status: 'VERIFIED',
      },
      { new: true }
    );
  }

  async getActionsByResponsible(responsibleId: string): Promise<ICorrectiveAction[]> {
    return await CorrectiveAction.find({ responsibleId })
      .populate('nonConformityId')
      .sort({ dueDate: 1 });
  }

  async getOverdueActions(): Promise<ICorrectiveAction[]> {
    const today = new Date();
    return await CorrectiveAction.find({
      dueDate: { $lt: today },
      status: { $in: ['PLANNED', 'IN_PROGRESS'] },
    })
      .populate('nonConformityId')
      .populate('responsibleId', 'firstName lastName email')
      .sort({ dueDate: 1 });
  }

  private buildQuery(filters: CorrectiveActionFilters): any {
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.actionType) {
      query.actionType = filters.actionType;
    }

    if (filters.nonConformityId) {
      query.nonConformityId = filters.nonConformityId;
    }

    if (filters.responsibleId) {
      query.responsibleId = filters.responsibleId;
    }

    if (filters.startDate || filters.endDate) {
      query.dueDate = {};
      if (filters.startDate) {
        query.dueDate.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.dueDate.$lte = filters.endDate;
      }
    }

    if (filters.search) {
      query.$or = [
        { description: { $regex: filters.search, $options: 'i' } },
        { actionNumber: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return query;
  }
}

export const correctiveActionRepository = new CorrectiveActionRepository();
