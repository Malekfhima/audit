import crypto from 'crypto';
import { authRepository } from './auth.repository';
import { userRepository } from '../users/user.repository';
import { hashPassword, comparePassword } from '../../core/auth/passwordUtils';
import { generateAccessToken, generateRefreshToken, getRefreshTokenExpiry } from '../../core/auth/tokenUtils';
import { UnauthorizedError, ConflictError, BadRequestError, NotFoundError } from '../../core/http/httpError';
import {
  LoginDto,
  RegisterDto,
  ChangePasswordDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './auth.types';
import { emailService } from '../../core/email/emailService';

class AuthService {
  async register(dto: RegisterDto) {
    const existing = await userRepository.findByEmail(dto.email);
    if (existing) throw new ConflictError('Email already registered');

    // Password is hashed by the User model's pre-save hook
    const user = await userRepository.create({
      ...dto,
      role: dto.role || 'USER' as any,
    });

    // In development, skip email verification — auto-verify the user
    // In production, send a verification email
    if (process.env.NODE_ENV === 'production') {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
      const expires = new Date();
      expires.setHours(expires.getHours() + 24);

      await userRepository.setEmailVerificationToken(user.id, hashedToken, expires);

      emailService.sendVerificationEmail(dto.email, rawToken).catch((err) => {
        console.warn('⚠️ Could not send verification email:', err.message);
      });
    } else {
      // Dev mode: auto-verify email
      await userRepository.setEmailVerified(user.id);
      // Update the local user object so the response reflects the change
      user.isEmailVerified = true;
    }

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

    // Check if account is active
    if (!user.isActive) {
      throw new UnauthorizedError('Account is deactivated. Contact an administrator.');
    }

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

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await userRepository.findByEmail(dto.email);
    // Always return success to prevent email enumeration
    if (!user) return { message: 'If the email exists, a reset link has been sent.' };

    // Generate a random token
    const rawToken = crypto.randomBytes(32).toString('hex');
    // Hash the token for storage (so DB compromise doesn't reveal tokens)
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // 1 hour expiry

    await userRepository.setPasswordResetToken(user.id, hashedToken, expires);

    // Send reset email (non-blocking — log failure in dev)
    emailService.sendPasswordResetEmail(dto.email, rawToken).catch((err) => {
      console.warn('⚠️ Could not send password reset email:', err.message);
    });

    const result: { message: string; resetToken?: string } = {
      message: 'If the email exists, a reset link has been sent.',
    };

    // In development, return the raw token as a fallback so developers
    // can test the flow even without an email service configured
    if (process.env.NODE_ENV === 'development') {
      result.resetToken = rawToken;
    }

    return result;
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const hashedToken = crypto.createHash('sha256').update(dto.token).digest('hex');

    const user = await userRepository.findByEmailVerificationToken(hashedToken);
    if (!user) throw new BadRequestError('Invalid or expired verification token');

    await userRepository.setEmailVerified(user.id);

    return { message: 'Email verified successfully.' };
  }

  async resendVerificationEmail(dto: ForgotPasswordDto) {
    const user = await userRepository.findByEmail(dto.email);
    if (!user) throw new NotFoundError('User not found');
    if (user.isEmailVerified) throw new BadRequestError('Email is already verified');

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expires = new Date();
    expires.setHours(expires.getHours() + 24);

    await userRepository.setEmailVerificationToken(user.id, hashedToken, expires);

    emailService.sendVerificationEmail(dto.email, rawToken).catch((err) => {
      console.warn('⚠️ Could not send verification email:', err.message);
    });

    return { message: 'Verification email sent.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const hashedToken = crypto.createHash('sha256').update(dto.token).digest('hex');

    const user = await userRepository.findByResetToken(hashedToken);
    if (!user) throw new BadRequestError('Invalid or expired reset token');

    const hashed = await hashPassword(dto.newPassword);
    await userRepository.update(user.id, { password: hashed });
    await userRepository.clearPasswordResetToken(user.id);
    await authRepository.revokeAllUserTokens(user.id);

    return { message: 'Password has been reset successfully.' };
  }
}

export const authService = new AuthService();
