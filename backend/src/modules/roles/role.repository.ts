import { Role, IRole } from './role.model';
import { CreateRoleDto, UpdateRoleDto, RoleFilters } from './role.types';
import { PaginationParams, getPaginationOptions } from '../../core/utils/pagination';

class RoleRepository {
  async create(data: CreateRoleDto): Promise<IRole> {
    const role = await Role.create(data);
    return role;
  }

  async findById(id: string): Promise<IRole | null> {
    return await Role.findById(id);
  }

  async findByName(name: string): Promise<IRole | null> {
    return await Role.findOne({ name: name.toUpperCase() });
  }

  async update(id: string, data: UpdateRoleDto): Promise<IRole | null> {
    if (data.name) {
      data.name = data.name.toUpperCase();
    }
    return await Role.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id: string): Promise<boolean> {
    const result = await Role.findByIdAndDelete(id);
    return !!result;
  }

  async find(filters: RoleFilters, pagination: PaginationParams): Promise<IRole[]> {
    const { skip, limit, sort } = getPaginationOptions(pagination);
    const query = this.buildQuery(filters);

    return await Role.find(query).skip(skip).limit(limit).sort(sort);
  }

  async count(filters: RoleFilters): Promise<number> {
    const query = this.buildQuery(filters);
    return await Role.countDocuments(query);
  }

  private buildQuery(filters: RoleFilters): any {
    const query: any = {};

    if (filters.name) {
      query.name = { $regex: filters.name, $options: 'i' };
    }

    if (filters.isSystemRole !== undefined) {
      query.isSystemRole = filters.isSystemRole;
    }

    return query;
  }
}

export const roleRepository = new RoleRepository();
