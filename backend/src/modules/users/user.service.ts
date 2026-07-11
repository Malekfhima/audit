import { userRepository } from './user.repository';
import { CreateUserDto, UpdateUserDto, UserFilters } from './user.types';
import { NotFoundError, ConflictError, BadRequestError } from '../../core/http/httpError';
import { PaginationParams, createPaginationResult } from '../../core/utils/pagination';
import { IUser } from './user.model';

class UserService {
  async createUser(dto: CreateUserDto): Promise<IUser> {
    const existing = await userRepository.findByEmail(dto.email);
    if (existing) throw new ConflictError('Email already registered');

    const user = await userRepository.create(dto);
    return user;
  }

  async getUserById(id: string): Promise<IUser> {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  async getUserByEmail(email: string): Promise<IUser> {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new NotFoundError('User not found');
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<IUser> {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError('User not found');

    if (dto.email && dto.email !== user.email) {
      const existing = await userRepository.findByEmail(dto.email);
      if (existing) throw new ConflictError('Email already taken');
    }

    const updated = await userRepository.update(id, dto);
    if (!updated) throw new NotFoundError('User not found');
    return updated;
  }

  async deleteUser(id: string): Promise<void> {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError('User not found');

    await userRepository.softDelete(id);
  }

  async getAllUsers(filters: UserFilters, pagination: PaginationParams) {
    const users = await userRepository.find(filters, pagination);
    const total = await userRepository.count(filters);
    return createPaginationResult(users, total, pagination);
  }

  async activateUser(id: string): Promise<IUser> {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError('User not found');

    const updated = await userRepository.update(id, { isActive: true });
    if (!updated) throw new NotFoundError('User not found');
    return updated;
  }

  async deactivateUser(id: string): Promise<IUser> {
    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError('User not found');

    const updated = await userRepository.update(id, { isActive: false });
    if (!updated) throw new NotFoundError('User not found');
    return updated;
  }

  async changeUserRole(id: string, newRole: string): Promise<IUser> {
    const validRoles = ['ADMIN', 'MANAGER', 'AUDITOR', 'USER'];
    if (!validRoles.includes(newRole)) {
      throw new BadRequestError('Invalid role value');
    }

    const user = await userRepository.findById(id);
    if (!user) throw new NotFoundError('User not found');

    const updated = await userRepository.update(id, { role: newRole as any });
    if (!updated) throw new NotFoundError('User not found');
    return updated;
  }

  async searchUsers(query: string, pagination: PaginationParams) {
    const filters: UserFilters = { search: query };
    return this.getAllUsers(filters, pagination);
  }
}

export const userService = new UserService();
