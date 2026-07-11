import { processRepository } from './process.repository';
import { CreateProcessDto, UpdateProcessDto, ProcessFilters } from './process.types';
import { NotFoundError, ConflictError } from '../../core/http/httpError';
import { PaginationParams, createPaginationResult } from '../../core/utils/pagination';
import { IProcess } from './process.model';
import { Site } from '../sites/site.model';
import { User } from '../users/user.model';

class ProcessService {
  async createProcess(dto: CreateProcessDto): Promise<IProcess> {
    const site = await Site.findById(dto.siteId);
    if (!site) throw new NotFoundError('Site not found');

    const existing = await processRepository.findByCode(dto.siteId, dto.code);
    if (existing) throw new ConflictError('Process code already exists in this site');

    if (dto.processOwnerId) {
      const owner = await User.findById(dto.processOwnerId);
      if (!owner) throw new NotFoundError('Process owner not found');
    }

    const process = await processRepository.create(dto);
    return process;
  }

  async getProcess(id: string): Promise<IProcess> {
    const process = await processRepository.findById(id);
    if (!process) throw new NotFoundError('Process not found');
    return process;
  }

  async updateProcess(id: string, dto: UpdateProcessDto): Promise<IProcess> {
    const process = await processRepository.findById(id);
    if (!process) throw new NotFoundError('Process not found');

    if (dto.code) {
      const existing = await processRepository.findByCode(process.siteId.toString(), dto.code);
      if (existing && existing._id.toString() !== id) {
        throw new ConflictError('Process code already exists in this site');
      }
    }

    if (dto.processOwnerId) {
      const owner = await User.findById(dto.processOwnerId);
      if (!owner) throw new NotFoundError('Process owner not found');
    }

    const updated = await processRepository.update(id, dto);
    if (!updated) throw new NotFoundError('Process not found');
    return updated;
  }

  async deleteProcess(id: string): Promise<void> {
    const process = await processRepository.findById(id);
    if (!process) throw new NotFoundError('Process not found');

    await processRepository.delete(id);
  }

  async getAllProcesses(filters: ProcessFilters, pagination: PaginationParams) {
    const processes = await processRepository.find(filters, pagination);
    const total = await processRepository.count(filters);
    return createPaginationResult(processes, total, pagination);
  }

  async getProcessesBySite(siteId: string): Promise<IProcess[]> {
    return await processRepository.findBySiteId(siteId);
  }

  async activateProcess(id: string): Promise<IProcess> {
    const process = await processRepository.findById(id);
    if (!process) throw new NotFoundError('Process not found');

    const updated = await processRepository.update(id, { isActive: true });
    if (!updated) throw new NotFoundError('Process not found');
    return updated;
  }

  async deactivateProcess(id: string): Promise<IProcess> {
    const process = await processRepository.findById(id);
    if (!process) throw new NotFoundError('Process not found');

    const updated = await processRepository.update(id, { isActive: false });
    if (!updated) throw new NotFoundError('Process not found');
    return updated;
  }
}

export const processService = new ProcessService();
