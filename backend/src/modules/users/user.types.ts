export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'MANAGER' | 'AUDITOR' | 'USER';
  organization?: string;
  phoneNumber?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  organization?: string;
  email?: string;
  isActive?: boolean;
  role?: 'ADMIN' | 'MANAGER' | 'AUDITOR' | 'USER';
  password?: string;
}

export interface UserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  organization?: string;
  phoneNumber?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
}

export interface UserFilters {
  role?: string;
  isActive?: boolean;
  search?: string;
  createdAfter?: Date;
  createdBefore?: Date;
}
