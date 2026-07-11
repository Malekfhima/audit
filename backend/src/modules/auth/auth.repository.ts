import { RefreshToken, IRefreshToken } from './auth.model';

class AuthRepository {
  createRefreshToken(data: Partial<IRefreshToken>) {
    return RefreshToken.create(data);
  }

  findTokenByValue(token: string) {
    return RefreshToken.findOne({ token }).populate('userId');
  }

  async revokeToken(token: string): Promise<boolean> {
    const res = await RefreshToken.updateOne(
      { token },
      { isRevoked: true }
    );
    return res.modifiedCount > 0;
  }

  async revokeAllUserTokens(userId: string): Promise<number> {
    const res = await RefreshToken.updateMany(
      { userId },
      { isRevoked: true }
    );
    return res.modifiedCount;
  }

  async deleteExpiredTokens(): Promise<number> {
    const res = await RefreshToken.deleteMany({
      expiresAt: { $lt: new Date() },
    });
    return res.deletedCount || 0;
  }
}

export const authRepository = new AuthRepository();
