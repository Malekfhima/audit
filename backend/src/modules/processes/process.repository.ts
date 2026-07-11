import { Process, IProcess } from './process.model';
import { CreateProcessDto, UpdateProcessDto, ProcessFilters } from './process.types';
import { PaginationParams, getPaginationOptions } from '../../core/utils/pagination';

class ProcessRepository {
  async create(data: CreateProcessDto): Promise<IProcess> {
    const process = await Process.create(data);
    return process;
  }

  async findById(id: string): Promise<IProcess | null> {
    return await Process.findById(id).populate('siteId', 'name code').populate('processOwnerId', 'firstName lastName email');
  }

  async findBySiteId(siteId: string): Promise<IProcess[]> {
    return await Process.find({ siteId }).populate('siteId', 'name code').populate('processOwnerId', 'firstName lastName email');
  }

  async findByCode(siteId: string, code: string): Promise<IProcess | null> {
    return await Process.findOne({ siteId, code: code.toUpperCase() });
  }

  async update(id: string, data: UpdateProcessDto): Promise<IProcess | null> {
    if (data.code) {
      data.code = data.code.toUpperCase();
    }
    return await Process.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('siteId', 'name code').populate('processOwnerId', 'firstName lastName email');
  }

  async delete(id: string): Promise<boolean> {
    const result = await Process.findByIdAndDelete(id);
    return !!result;
  }

  async find(filters: ProcessFilters, pagination: PaginationParams): Promise<IProcess[]> {
    const { skip, limit, sort } = getPaginationOptions(pagination);
    const query = this.buildQuery(filters);

    return await Process.find(query).populate('siteId', 'name code').populate('processOwnerId', 'firstName lastName email').skip(skip).limit(limit).sort(sort);
  }

  async count(filters: ProcessFilters): Promise<number> {
    const query = this.buildQuery(filters);
    return await Process.countDocuments(query);
  }

  private buildQuery(filters: ProcessFilters): any {
    const query: any = {};

    if (filters.siteId) {
      query.siteId = filters.siteId;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters.search) {
      query.$or = [
        { name: { $regex: filters.search, $options: 'i' } },
        { code: { $regex: filters.search, $options: 'i' } },
      ];
    }

    return query;
  }
}

export const processRepository = new ProcessRepository();
