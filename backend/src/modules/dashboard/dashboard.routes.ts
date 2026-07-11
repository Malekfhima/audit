import { Router } from 'express';
import * as dashboardController from './dashboard.controller';
import { authenticate } from '../../core/auth/authMiddleware';
import { authorize } from '../../core/auth/roleMiddleware';

const router = Router();

router.get('/overview', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), dashboardController.getOverviewStats);
router.get('/timeseries/:metric', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), dashboardController.getTimeSeriesData);
router.get('/top-issues', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), dashboardController.getTopIssues);

export default router;
