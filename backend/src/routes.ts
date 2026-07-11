// src/routes.ts
import { Router } from 'express';

import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import roleRoutes from './modules/roles/role.routes';
import normRoutes from './modules/norms/norm.routes';
import siteRoutes from './modules/sites/site.routes';
import processRoutes from './modules/processes/process.routes';
import auditRoutes from './modules/audits/audit.routes';
import auditEntryRoutes from './modules/auditEntries/auditEntry.routes';
import nonConformityRoutes from './modules/nonConformities/nonConformity.routes';
import correctiveActionRoutes from './modules/correctiveActions/correctiveAction.routes';
import riskRoutes from './modules/risks/risk.routes';
import legalRoutes from './modules/legal/legal.routes';
import notificationRoutes from './modules/notifications/notification.routes';
import reportRoutes from './modules/reports/report.routes';
import dashboardRoutes from './modules/dashboard/dashboard.routes';

const router = Router();

// Auth
router.use('/auth', authRoutes);

// Core modules
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);

// Business modules
router.use('/norms', normRoutes);
router.use('/sites', siteRoutes);
router.use('/processes', processRoutes);
router.use('/audits', auditRoutes);
router.use('/audit-entries', auditEntryRoutes);
router.use('/non-conformities', nonConformityRoutes);
router.use('/corrective-actions', correctiveActionRoutes);
router.use('/risks', riskRoutes);
router.use('/legal', legalRoutes);

// System
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
