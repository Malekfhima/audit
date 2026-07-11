import { Router } from 'express';
import * as nonConformityController from './nonConformity.controller';
import { authenticate } from '../../core/auth/authMiddleware';
import { authorize } from '../../core/auth/roleMiddleware';

const router = Router();

router.post('/', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), nonConformityController.createNC);
router.get('/', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), nonConformityController.getAllNCs);
router.get('/statistics', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), nonConformityController.getNCStatistics);
router.get('/open', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), nonConformityController.getOpenNCs);
router.get('/:id', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), nonConformityController.getNC);
router.put('/:id', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), nonConformityController.updateNC);
router.delete('/:id', authenticate, authorize('ADMIN'), nonConformityController.deleteNC);
router.post('/:id/assign', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), nonConformityController.assignNC);
router.patch('/:id/status', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), nonConformityController.updateStatus);
router.post('/:id/root-cause', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), nonConformityController.addRootCause);
router.post('/:id/immediate-action', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), nonConformityController.addImmediateAction);
router.post('/:id/close', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), nonConformityController.closeNC);
router.post('/:id/verify', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), nonConformityController.verifyNC);
router.post('/:id/reopen', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), nonConformityController.reopenNC);
router.get('/audit/:auditId', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), nonConformityController.getNCsByAudit);

export default router;
