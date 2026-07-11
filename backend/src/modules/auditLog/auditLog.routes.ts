import { Router } from 'express';
import * as auditLogController from './auditLog.controller';
import { authenticate } from '../../core/auth/authMiddleware';
import { authorize } from '../../core/auth/roleMiddleware';

const router = Router();

router.get('/', authenticate, authorize('ADMIN', 'MANAGER'), auditLogController.getLogs);
router.get('/entity/:entityType/:entityId', authenticate, authorize('ADMIN', 'MANAGER'), auditLogController.getEntityHistory);
router.get('/user/:userId', authenticate, authorize('ADMIN', 'MANAGER'), auditLogController.getUserActivity);
router.get('/security', authenticate, authorize('ADMIN', 'MANAGER'), auditLogController.getSecurityLogs);
router.post('/cleanup', authenticate, authorize('ADMIN'), auditLogController.cleanupOldLogs);

export default router;
