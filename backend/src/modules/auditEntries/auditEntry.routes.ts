import { Router } from 'express';
import * as auditEntryController from './auditEntry.controller';
import { authenticate } from '../../core/auth/authMiddleware';
import { authorize } from '../../core/auth/roleMiddleware';

const router = Router();

router.post('/', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), auditEntryController.createAuditEntry);
router.post('/bulk', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), auditEntryController.createBulkAuditEntries);
router.get('/audit/:auditId', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), auditEntryController.getEntriesByAudit);
router.get('/audit/:auditId/statistics', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), auditEntryController.getAuditStatistics);
router.get('/:id', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), auditEntryController.getEntryById);
router.put('/:id', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), auditEntryController.updateAuditEntry);
router.delete('/:id', authenticate, authorize('ADMIN', 'MANAGER'), auditEntryController.deleteAuditEntry);
router.post('/:id/verify', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), auditEntryController.verifyAuditEntry);
router.post('/:id/mark-verified', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), auditEntryController.markAsVerified);
router.post('/:id/evidence', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), auditEntryController.addEvidence);

export default router;
