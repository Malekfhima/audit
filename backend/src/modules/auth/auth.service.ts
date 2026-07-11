import { authRepository } from './auth.repository';
import { userRepository } from '../users/user.repository';
import { hashPassword, comparePassword } from '../../core/auth/passwordUtils';
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } from '../../core/auth/tokenUtils';
import { UnauthorizedError, ConflictError } from '../../core/http/httpError';
import {
  LoginDto,
  RegisterDto,
  ChangePasswordDto,
} from './auth.types';

class AuthService {
  async register(dto: RegisterDto) {
    const existing = await userRepository.findByEmail(dto.email);
    if (existing) throw new ConflictError('Email already registered');

    const hashed = await hashPassword(dto.password);

    const user = await userRepository.create({
      ...dto,
      password: hashed,
      role: dto.role || 'AUDITOR' as any,
    });

    const accessToken = generateAccessToken({ userId: user.id });
    const refreshToken = generateRefreshToken({ userId: user.id });

    await authRepository.createRefreshToken({
      token: refreshToken,
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
    });

    return { user, accessToken, refreshToken };
  }

  async login(dto: LoginDto) {
    const user = await userRepository.findByEmail(dto.email);
    if (!user) throw new UnauthorizedError('Invalid credentials');

    const valid = await comparePassword(
      dto.password,
      user.password
    );
    if (!valid) throw new UnauthorizedError('Invalid credentials');

    const accessToken = generateAccessToken({ userId: user.id });
    const refreshToken = generateRefreshToken({ userId: user.id });

    await authRepository.createRefreshToken({
      token: refreshToken,
      userId: user.id,
      expiresAt: getRefreshTokenExpiry(),
    });

    await userRepository.updateLastLogin(user.id);

    return { user, accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    const stored = await authRepository.findTokenByValue(refreshToken);
    if (!stored || stored.isRevoked)
      throw new UnauthorizedError('Invalid refresh token');

    const accessToken = generateAccessToken({ userId: stored.userId.toString() });

    return { accessToken };
  }

  async logout(refreshToken: string) {
    await authRepository.revokeToken(refreshToken);
  }

  async logoutAll(userId: string) {
    await authRepository.revokeAllUserTokens(userId);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await userRepository.findByIdWithPassword(userId);
    if (!user) throw new UnauthorizedError();

    const valid = await comparePassword(
      dto.currentPassword,
      user.password
    );
    if (!valid) throw new UnauthorizedError('Invalid password');

    const hashed = await hashPassword(dto.newPassword);
    await userRepository.update(userId, { password: hashed });

    await authRepository.revokeAllUserTokens(userId);
  }
}

export const authService = new AuthService();
