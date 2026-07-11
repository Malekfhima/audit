import { Router } from 'express';
import * as correctiveActionController from './correctiveAction.controller';
import { authenticate } from '../../core/auth/authMiddleware';
import { authorize } from '../../core/auth/roleMiddleware';

const router = Router();

router.post('/', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), correctiveActionController.createAction);
router.get('/', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), correctiveActionController.getAllActions);
router.get('/overdue', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), correctiveActionController.getOverdueActions);
router.get('/statistics', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), correctiveActionController.getActionsStatistics);
router.get('/nc/:ncId', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), correctiveActionController.getActionsByNC);
router.get('/responsible/:responsibleId', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), correctiveActionController.getActionsByResponsible);
router.get('/:id', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), correctiveActionController.getAction);
router.put('/:id', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), correctiveActionController.updateAction);
router.delete('/:id', authenticate, authorize('ADMIN'), correctiveActionController.deleteAction);
router.patch('/:id/status', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), correctiveActionController.updateStatus);
router.post('/:id/complete', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), correctiveActionController.markAsCompleted);
router.post('/:id/verify', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), correctiveActionController.verifyEffectiveness);
router.post('/:id/mark-ineffective', authenticate, authorize('AUDITOR', 'ADMIN', 'MANAGER'), correctiveActionController.markAsIneffective);

export default router;
