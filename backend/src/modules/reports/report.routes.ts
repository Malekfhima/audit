import { Router } from 'express';
import * as reportController from './report.controller';
import { authenticate } from '../../core/auth/authMiddleware';
import { authorize } from '../../core/auth/roleMiddleware';

const router = Router();

router.post('/', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), reportController.generateReport);
router.get('/', authenticate, reportController.getUserReports);
router.get('/all', authenticate, authorize('ADMIN', 'MANAGER'), reportController.getAllReports);
router.get('/:id', authenticate, reportController.getReport);
router.delete('/:id', authenticate, reportController.deleteReport);
router.patch('/:id/completed', authenticate, authorize('ADMIN', 'MANAGER'), reportController.markAsCompleted);
router.patch('/:id/failed', authenticate, authorize('ADMIN', 'MANAGER'), reportController.markAsFailed);
router.post('/cleanup', authenticate, authorize('ADMIN'), reportController.deleteExpiredReports);

export default router;
