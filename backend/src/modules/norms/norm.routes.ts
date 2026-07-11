import { Router } from 'express';
import {
  createNorm,
  getNorm,
  updateNorm,
  deleteNorm,
  getAllNorms,
  activateNorm,
  archiveNorm,
} from './norm.controller';
import { authenticate } from '../../core/auth/authMiddleware';
import { authorize } from '../../core/auth/roleMiddleware';

const router = Router();

router.post('/', authenticate, authorize('ADMIN', 'MANAGER'), createNorm);
router.get('/', authenticate, getAllNorms);
router.get('/:id', authenticate, getNorm);
router.put('/:id', authenticate, authorize('ADMIN', 'MANAGER'), updateNorm);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteNorm);
router.post('/:id/activate', authenticate, authorize('ADMIN'), activateNorm);
router.post('/:id/archive', authenticate, authorize('ADMIN'), archiveNorm);

export default router;
