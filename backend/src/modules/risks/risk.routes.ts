import { Router } from 'express';
import * as riskController from './risk.controller';
import { authenticate } from '../../core/auth/authMiddleware';
import { authorize } from '../../core/auth/roleMiddleware';

const router = Router();

router.post('/', authenticate, authorize('ADMIN', 'MANAGER'), riskController.createRisk);
router.get('/', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), riskController.getAllRisks);
router.get('/matrix', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), riskController.getRiskMatrix);
router.get('/statistics', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), riskController.getRiskStatistics);
router.get('/level/:level', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), riskController.getRisksByLevel);
router.get('/owner/:ownerId', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), riskController.getRisksByOwner);
router.get('/review', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), riskController.getRisksNeedingReview);
router.get('/:id', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), riskController.getRisk);
router.put('/:id', authenticate, authorize('ADMIN', 'MANAGER'), riskController.updateRisk);
router.delete('/:id', authenticate, authorize('ADMIN'), riskController.deleteRisk);
router.post('/:id/assess', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), riskController.assessRisk);
router.post('/:id/mitigation', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), riskController.addMitigationPlan);
router.post('/:id/residual', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), riskController.updateResidualRisk);
router.patch('/:id/status', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), riskController.updateStatus);
router.post('/:id/assign', authenticate, authorize('ADMIN', 'MANAGER'), riskController.assignOwner);
router.post('/:id/link', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), riskController.linkRiskToEntity);
router.delete('/:id/link/:linkId', authenticate, authorize('ADMIN', 'MANAGER'), riskController.unlinkRisk);
router.get('/:id/links', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), riskController.getRiskLinks);
router.get('/entity/:linkedEntityType/:linkedEntityId', authenticate, authorize('ADMIN', 'MANAGER', 'AUDITOR'), riskController.getEntityLinks);

export default router;
