import { Router } from 'express';
import {
  createProcess,
  getProcess,
  updateProcess,
  deleteProcess,
  getAllProcesses,
  getProcessesBySite,
  activateProcess,
  deactivateProcess,
} from './process.controller';
import { authenticate } from '../../core/auth/authMiddleware';
import { authorize } from '../../core/auth/roleMiddleware';

const router = Router();

router.post('/', authenticate, authorize('ADMIN', 'MANAGER'), createProcess);
router.get('/', authenticate, getAllProcesses);
router.get('/site/:siteId', authenticate, getProcessesBySite);
router.get('/:id', authenticate, getProcess);
router.put('/:id', authenticate, authorize('ADMIN', 'MANAGER'), updateProcess);
router.delete('/:id', authenticate, authorize('ADMIN'), deleteProcess);
router.post('/:id/activate', authenticate, authorize('ADMIN'), activateProcess);
router.post('/:id/deactivate', authenticate, authorize('ADMIN'), deactivateProcess);

export default router;
