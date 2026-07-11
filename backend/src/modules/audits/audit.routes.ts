import { Router } from 'express';
import {
  createAudit,
  getAudit,
  updateAudit,
  deleteAudit,
  getAllAudits,
  startAudit,
  completeAudit,
  cancelAudit,
  addSummary,
  assignAuditors,
  assignAuditees,
  calculateScore,
  getUpcomingAudits,
  getActiveAudits,
  getCompletedAudits,
} from './audit.controller';
import { authenticate } from '../../core/auth/authMiddleware';
import { authorize } from '../../core/auth/roleMiddleware';

const router = Router();

router.post('/', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), createAudit);
router.get('/', authenticate, getAllAudits);
router.get('/upcoming', authenticate, getUpcomingAudits);
router.get('/active', authenticate, getActiveAudits);
router.get('/completed', authenticate, getCompletedAudits);
router.get('/:id', authenticate, getAudit);
router.put('/:id', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), updateAudit);
router.delete('/:id', authenticate, authorize('ADMIN', 'MANAGER'), deleteAudit);
router.post('/:id/start', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), startAudit);
router.post('/:id/complete', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), completeAudit);
router.post('/:id/cancel', authenticate, authorize('ADMIN', 'MANAGER'), cancelAudit);
router.post('/:id/summary', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), addSummary);
router.post('/:id/auditors', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), assignAuditors);
router.post('/:id/auditees', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), assignAuditees);
router.post('/:id/calculate-score', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), calculateScore);

export default router;
