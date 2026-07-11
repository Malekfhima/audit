import { Router } from 'express';
import * as legalController from './legal.controller';
import { authenticate } from '../../core/auth/authMiddleware';
import { authorize } from '../../core/auth/roleMiddleware';

const router = Router();

const requirementsRouter = Router();
requirementsRouter.post('/', authenticate, authorize('ADMIN', 'MANAGER'), legalController.createRequirement);
requirementsRouter.get('/', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), legalController.getAllRequirements);
requirementsRouter.get('/upcoming-reviews', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), legalController.getUpcomingReviews);
requirementsRouter.get('/site/:siteId', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), legalController.getRequirementsBySite);
requirementsRouter.get('/:id', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), legalController.getRequirement);
requirementsRouter.put('/:id', authenticate, authorize('ADMIN', 'MANAGER'), legalController.updateRequirement);
requirementsRouter.delete('/:id', authenticate, authorize('ADMIN'), legalController.deleteRequirement);
requirementsRouter.post('/:id/sites', authenticate, authorize('ADMIN', 'MANAGER'), legalController.assignToSites);
requirementsRouter.post('/:id/responsible', authenticate, authorize('ADMIN', 'MANAGER'), legalController.assignResponsible);

const complianceRouter = Router();
complianceRouter.post('/', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), legalController.assessCompliance);
complianceRouter.get('/', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), legalController.getAllCompliances);
complianceRouter.get('/non-compliant', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), legalController.getNonCompliantRequirements);
complianceRouter.get('/review', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), legalController.getCompliancesNeedingReview);
complianceRouter.get('/statistics', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), legalController.getComplianceStatistics);
complianceRouter.get('/site/:siteId/report', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), legalController.getComplianceReport);
complianceRouter.get('/:id', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), legalController.getCompliance);
complianceRouter.patch('/:id/status', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), legalController.updateComplianceStatus);
complianceRouter.post('/:id/action-plan', authenticate, authorize('ADMIN', 'MANAGER'), legalController.linkActionPlan);

router.use('/requirements', requirementsRouter);
router.use('/compliance', complianceRouter);

export default router;
