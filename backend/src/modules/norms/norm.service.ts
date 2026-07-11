import { normRepository } from './norm.repository';
import { CreateNormDto, UpdateNormDto, NormFilters } from './norm.types';
import { NotFoundError, ConflictError } from '../../core/http/httpError';
import { PaginationParams, createPaginationResult } from '../../core/utils/pagination';
import { INorm } from './norm.model';

class NormService {
  async createNorm(dto: CreateNormDto, userId: string): Promise<INorm> {
    const existing = await normRepository.findByCode(dto.code);
    if (existing) throw new ConflictError('Norm code already exists');

    const norm = await normRepository.create({ ...dto, createdBy: userId as any });
    return norm;
  }

  async getNorm(id: string): Promise<INorm> {
    const norm = await normRepository.findById(id);
    if (!norm) throw new NotFoundError('Norm not found');
    return norm;
  }

  async updateNorm(id: string, dto: UpdateNormDto): Promise<INorm> {
    const norm = await normRepository.findById(id);
    if (!norm) throw new NotFoundError('Norm not found');

    if (dto.code) {
      const existing = await normRepository.findByCode(dto.code);
      if (existing && existing._id.toString() !== id) {
        throw new ConflictError('Norm code already exists');
      }
    }

    const updated = await normRepository.update(id, dto);
    if (!updated) throw new NotFoundError('Norm not found');
    return updated;
  }

  async deleteNorm(id: string): Promise<void> {
    const norm = await normRepository.findById(id);
    if (!norm) throw new NotFoundError('Norm not found');

    await normRepository.delete(id);
  }

  async getAllNorms(filters: NormFilters, pagination: PaginationParams) {
    const norms = await normRepository.find(filters, pagination);
    const total = await normRepository.count(filters);
    return createPaginationResult(norms, total, pagination);
  }

  async activateNorm(id: string): Promise<INorm> {
    const norm = await normRepository.findById(id);
    if (!norm) throw new NotFoundError('Norm not found');

    const updated = await normRepository.update(id, { status: 'ACTIVE' });
    if (!updated) throw new NotFoundError('Norm not found');
    return updated;
  }

  async archiveNorm(id: string): Promise<INorm> {
    const norm = await normRepository.findById(id);
    if (!norm) throw new NotFoundError('Norm not found');

    const updated = await normRepository.update(id, { status: 'ARCHIVED' });
    if (!updated) throw new NotFoundError('Norm not found');
    return updated;
  }
}

export const normService = new NormService();
