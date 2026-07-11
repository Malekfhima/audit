import { Router } from 'express';
import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  getAllUsers,
  activateUser,
  deactivateUser,
  changeUserRole,
  getCurrentUserProfile,
  updateCurrentUserProfile,
} from './user.controller';
import { authenticate } from '../../core/auth/authMiddleware';
import { authorize } from '../../core/auth/roleMiddleware';

const router = Router();

// Special routes (must be defined before /:id routes)
router.get('/me', authenticate, getCurrentUserProfile);
router.put('/me', authenticate, updateCurrentUserProfile);

// Standard CRUD routes
router.post('/', authenticate, authorize('ADMIN'), createUser);
router.get('/', authenticate, authorize('ADMIN', 'MANAGER'), getAllUsers);
router.get('/:id', authenticate, getUser);
router.put('/:id', authenticate, updateUser);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteUser);

// Action routes
router.post('/:id/activate', authenticate, authorize('ADMIN'), activateUser);
router.post('/:id/deactivate', authenticate, authorize('ADMIN'), deactivateUser);
router.patch('/:id/role', authenticate, authorize('ADMIN'), changeUserRole);

export default router;
