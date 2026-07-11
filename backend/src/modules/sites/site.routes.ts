import { Router } from 'express';
import {
  createSite,
  getSite,
  updateSite,
  deleteSite,
  getAllSites,
  activateSite,
  deactivateSite,
} from './site.controller';
import { authenticate } from '../../core/auth/authMiddleware';
import { authorize } from '../../core/auth/roleMiddleware';

const router = Router();

router.post('/', authenticate, authorize('ADMIN', 'MANAGER'), createSite);
router.get('/', authenticate, getAllSites);
router.get('/:id', authenticate, getSite);
router.put('/:id', authenticate, authorize('ADMIN', 'MANAGER'), updateSite);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteSite);
router.post('/:id/activate', authenticate, authorize('ADMIN'), activateSite);
router.post('/:id/deactivate', authenticate, authorize('ADMIN'), deactivateSite);

export default router;
