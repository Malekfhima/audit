import { Router } from 'express';
import {
  createRole,
  getRole,
  updateRole,
  deleteRole,
  getAllRoles,
  assignPermissions,
  removePermissions,
  getRolePermissions,
} from './role.controller';
import { authenticate } from '../../core/auth/authMiddleware';
import { authorize } from '../../core/auth/roleMiddleware';

const router = Router();

router.post('/', authenticate, authorize('ADMIN'), createRole);
router.get('/', authenticate, authorize('ADMIN', 'MANAGER'), getAllRoles);
router.get('/:id', authenticate, authorize('ADMIN', 'MANAGER'), getRole);
router.put('/:id', authenticate, authorize('ADMIN'), updateRole);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteRole);
router.post('/:id/permissions', authenticate, authorize('ADMIN'), assignPermissions);
router.delete('/:id/permissions', authenticate, authorize('ADMIN'), removePermissions);
router.get('/:id/permissions', authenticate, authorize('ADMIN', 'MANAGER'), getRolePermissions);

export default router;
