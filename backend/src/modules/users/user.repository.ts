import { User, IUser } from './user.model';
import { CreateUserDto, UpdateUserDto, UserFilters } from './user.types';
import { PaginationParams, getPaginationOptions } from '../../core/utils/pagination';

class UserRepository {
  async create(data: CreateUserDto): Promise<IUser> {
    const user = await User.create(data);
    return user;
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id).select('-password');
  }

  async findByIdWithPassword(id: string): Promise<IUser | null> {
    return await User.findById(id).select('+password');
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email }).select('+password');
  }

  async update(id: string, data: UpdateUserDto): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-password');
  }

  async delete(id: string): Promise<boolean> {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });
    return !!result;
  }

  async find(filters: UserFilters, pagination: PaginationParams): Promise<IUser[]> {
    const { skip, limit, sort } = getPaginationOptions(pagination);
    const query = this.buildQuery(filters);

    return await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort(sort);
  }

  async count(filters: UserFilters): Promise<number> {
    const query = this.buildQuery(filters);
    return await User.countDocuments(query);
  }

  async updateLastLogin(id: string): Promise<void> {
    await User.findByIdAndUpdate(id, { lastLoginAt: new Date() });
  }

  async setEmailVerified(id: string): Promise<boolean> {
    const result = await User.findByIdAndUpdate(
      id,
      { isEmailVerified: true, emailVerificationToken: undefined, emailVerificationExpires: undefined },
      { new: true }
    );
    return !!result;
  }

  async findByResetToken(token: string): Promise<IUser | null> {
    return await User.findOne({
      passwordResetToken: token,
      passwordResetExpires: { $gt: new Date() }
    }).select('+password');
  }

  async setPasswordResetToken(id: string, token: string, expires: Date): Promise<boolean> {
    const result = await User.findByIdAndUpdate(
      id,
      { passwordResetToken: token, passwordResetExpires: expires },
      { new: true }
    );
    return !!result;
  }

  async clearPasswordResetToken(id: string): Promise<boolean> {
    const result = await User.findByIdAndUpdate(
      id,
      { passwordResetToken: undefined, passwordResetExpires: undefined },
      { new: true }
    );
    return !!result;
  }

  private buildQuery(filters: UserFilters): any {
    const query: any = {};

    if (filters.role) {
      query.role = filters.role;
    }

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters.search) {
      query.$or = [
        { firstName: { $regex: filters.search, $options: 'i' } },
        { lastName: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
      ];
    }

    if (filters.createdAfter || filters.createdBefore) {
      query.createdAt = {};
      if (filters.createdAfter) {
        query.createdAt.$gte = filters.createdAfter;
      }
      if (filters.createdBefore) {
        query.createdAt.$lte = filters.createdBefore;
      }
    }

    return query;
  }
}

export const userRepository = new UserRepository();
