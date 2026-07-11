import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../http/httpError';

/**
 * Role hierarchy (optional)
 * Higher role includes permissions of lower roles
 */
const ROLE_HIERARCHY: Record<string, number> = {
  ADMIN: 4,
  MANAGER: 3,
  AUDITOR: 2,
  USER: 1,
};

/**
 * Role-based authorization middleware
 */
export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const userRole = req.user.role;

    if (!userRole) {
      throw new ForbiddenError('User role not defined');
    }

    // Direct role match
    if (allowedRoles.includes(userRole)) {
      return next();
    }

    // Role hierarchy check (ADMIN > MANAGER > AUDITOR > USER)
    const userRoleLevel = ROLE_HIERARCHY[userRole];
    const minRequiredLevel = Math.max(
      ...allowedRoles.map((role) => ROLE_HIERARCHY[role] || 0)
    );

    if (userRoleLevel >= minRequiredLevel) {
      return next();
    }

    throw new ForbiddenError('Insufficient permissions');
  };
};

/**
 * Permission-based authorization middleware
 * (Requires req.user.permissions: string[])
 */
export const authorizePermission = (...requiredPermissions: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    const userPermissions: string[] = req.user.permissions || [];

    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission)
    );

    if (!hasAllPermissions) {
      throw new ForbiddenError('Insufficient permissions');
    }

    next();
  };
};

export default authorize;
