// ==============================================
// MODULE: NORMS - REPOSITORY LAYER
// ==============================================
// Database operations for norms, clauses, and checklists

import { Norm, INorm } from './norm.model';
import { CreateNormDto, UpdateNormDto, NormFilters } from './norm.types';
import { PaginationParams, getPaginationOptions } from '../../core/utils/pagination';

class NormRepository {
  async create(data: CreateNormDto): Promise<INorm> {
    const norm = await Norm.create(data);
    return norm;
  }

  async findById(id: string): Promise<INorm | null> {
    return await Norm.findById(id).populate('createdBy', 'firstName lastName email');
  }

  async findByCode(code: string): Promise<INorm | null> {
    return await Norm.findOne({ code: code.toUpperCase() });
  }

  async update(id: string, data: UpdateNormDto): Promise<INorm | null> {
    if (data.code) {
      data.code = data.code.toUpperCase();
    }
    return await Norm.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Norm.findByIdAndDelete(id);
    return !!result;
  }

  async find(filters: NormFilters, pagination: PaginationParams): Promise<INorm[]> {
    const { skip, limit, sort } = getPaginationOptions(pagination);
    const query = this.buildQuery(filters);

    return await Norm.find(query).populate('createdBy', 'firstName lastName email').skip(skip).limit(limit).sort(sort);
  }

  async count(filters: NormFilters): Promise<number> {
    const query = this.buildQuery(filters);
    return await Norm.countDocuments(query);
  }

  private buildQuery(filters: NormFilters): any {
    const query: any = {};

    if (filters.status) {
      query.status = filters.status;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.code) {
      query.code = { $regex: filters.code, $options: 'i' };
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { code: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return query;
  }
}

export const normRepository = new NormRepository();

//
// ClauseRepository methods:
// - create(data): Create clause
// - findByNormId(normId): Get all clauses for a norm
// - findByClauseNumber(normId, clauseNumber): Get specific clause
// - update(id, data): Update clause
// - delete(id): Delete clause
//
// ChecklistRepository methods:
// - create(data): Create checklist template
// - findById(id): Get checklist with clauses populated
// - findByNormId(normId): Get checklists for a norm
// - update(id, data): Update checklist
// - delete(id): Delete checklist
