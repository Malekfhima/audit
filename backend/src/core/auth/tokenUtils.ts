import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config/config';

/**
 * Token payload interface
 */
export interface TokenPayload {
  userId: string;
  email?: string;
  role?: string;
  [key: string]: any;
}

/**
 * Generate JWT access token
 */
export const generateAccessToken = (payload: TokenPayload): string => {
  const secret = config.jwt.jwtSecret || 'default-secret-key';
  return jwt.sign(payload, secret, {
    expiresIn: config.jwt.jwtExpiresIn,
  } as jwt.SignOptions);
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (payload: TokenPayload): string => {
  const secret = config.jwt.refreshTokenSecret || 'default-refresh-secret-key';
  return jwt.sign(payload, secret, {
    expiresIn: config.jwt.refreshTokenExpiresIn,
  } as jwt.SignOptions);
};

/**
 * Verify access token
 */
export const verifyAccessToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(token, config.jwt.jwtSecret) as JwtPayload;
  return decoded as TokenPayload;
};

/**
 * Verify refresh token
 */
export const verifyRefreshToken = (token: string): TokenPayload => {
  const decoded = jwt.verify(
    token,
    config.jwt.refreshTokenSecret
  ) as JwtPayload;

  return decoded as TokenPayload;
};

/**
 * Generate access + refresh token pair
 */
export const generateTokenPair = (
  payload: TokenPayload
): { accessToken: string; refreshToken: string } => {
  const accessToken = generateAccessToken({
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
  });

  const refreshToken = generateRefreshToken({
    userId: payload.userId,
  });

  return { accessToken, refreshToken };
};

/**
 * Decode token without verification (debug only)
 */
export const decodeToken = (token: string): TokenPayload | null => {
  const decoded = jwt.decode(token);
  return decoded ? (decoded as TokenPayload) : null;
};

/**
 * Get refresh token expiry date
 */
export const getRefreshTokenExpiry = (): Date => {
  const expiresIn = config.jwt.refreshTokenExpiresIn;
  const expiryDate = new Date();
  
  // Parse the expiresIn string (e.g., '7d', '30d')
  const match = expiresIn.match(/(\d+)([dhm])/);
  if (match) {
    const value = parseInt(match[1]);
    const unit = match[2];
    
    switch (unit) {
      case 'd':
        expiryDate.setDate(expiryDate.getDate() + value);
        break;
      case 'h':
        expiryDate.setHours(expiryDate.getHours() + value);
        break;
      case 'm':
        expiryDate.setMinutes(expiryDate.getMinutes() + value);
        break;
    }
  }
  
  return expiryDate;
};
