import { roleRepository } from './role.repository';
import { CreateRoleDto, UpdateRoleDto, RoleFilters } from './role.types';
import { NotFoundError, ConflictError, BadRequestError } from '../../core/http/httpError';
import { PaginationParams, createPaginationResult } from '../../core/utils/pagination';
import { IRole } from './role.model';
import { User } from '../users/user.model';

class RoleService {
  async createRole(dto: CreateRoleDto): Promise<IRole> {
    const existing = await roleRepository.findByName(dto.name);
    if (existing) throw new ConflictError('Role name already exists');

    const role = await roleRepository.create(dto);
    return role;
  }

  async getRole(id: string): Promise<IRole> {
    const role = await roleRepository.findById(id);
    if (!role) throw new NotFoundError('Role not found');
    return role;
  }

  async updateRole(id: string, dto: UpdateRoleDto): Promise<IRole> {
    const role = await roleRepository.findById(id);
    if (!role) throw new NotFoundError('Role not found');

    if (role.isSystemRole) {
      throw new BadRequestError('Cannot modify system roles');
    }

    if (dto.name) {
      const existing = await roleRepository.findByName(dto.name);
      if (existing && existing._id.toString() !== id) {
        throw new ConflictError('Role name already exists');
      }
    }

    const updated = await roleRepository.update(id, dto);
    if (!updated) throw new NotFoundError('Role not found');
    return updated;
  }

  async deleteRole(id: string): Promise<void> {
    const role = await roleRepository.findById(id);
    if (!role) throw new NotFoundError('Role not found');

    if (role.isSystemRole) {
      throw new BadRequestError('Cannot delete system roles');
    }

    const usersWithRole = await User.countDocuments({ role: role.name });
    if (usersWithRole > 0) {
      throw new BadRequestError('Cannot delete role with assigned users');
    }

    await roleRepository.delete(id);
  }

  async getAllRoles(filters: RoleFilters, pagination: PaginationParams) {
    const roles = await roleRepository.find(filters, pagination);
    const total = await roleRepository.count(filters);
    return createPaginationResult(roles, total, pagination);
  }

  async assignPermissionsToRole(roleId: string, permissions: string[]): Promise<IRole> {
    const role = await roleRepository.findById(roleId);
    if (!role) throw new NotFoundError('Role not found');

    const updated = await roleRepository.update(roleId, {
      permissions: [...new Set([...role.permissions, ...permissions])],
    });
    if (!updated) throw new NotFoundError('Role not found');
    return updated;
  }

  async removePermissionsFromRole(roleId: string, permissions: string[]): Promise<IRole> {
    const role = await roleRepository.findById(roleId);
    if (!role) throw new NotFoundError('Role not found');

    const updatedPermissions = role.permissions.filter(p => !permissions.includes(p));
    const updated = await roleRepository.update(roleId, { permissions: updatedPermissions });
    if (!updated) throw new NotFoundError('Role not found');
    return updated;
  }

  async getRolePermissions(roleId: string): Promise<string[]> {
    const role = await roleRepository.findById(roleId);
    if (!role) throw new NotFoundError('Role not found');
    return role.permissions;
  }
}

export const roleService = new RoleService();
