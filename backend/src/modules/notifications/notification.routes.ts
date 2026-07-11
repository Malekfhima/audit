import { Router } from 'express';
import * as notificationController from './notification.controller';
import { authenticate } from '../../core/auth/authMiddleware';
import { authorize } from '../../core/auth/roleMiddleware';

const router = Router();

router.post('/', authenticate, authorize('ADMIN', 'MANAGER'), notificationController.createNotification);
router.get('/', authenticate, notificationController.getNotifications);
router.get('/unread-count', authenticate, notificationController.getUnreadCount);
router.get('/:id', authenticate, notificationController.getNotification);
router.patch('/:id/read', authenticate, notificationController.markAsRead);
router.patch('/read-all', authenticate, notificationController.markAllAsRead);
router.post('/:id/archive', authenticate, notificationController.archiveNotification);
router.delete('/:id', authenticate, notificationController.deleteNotification);
router.post('/cleanup', authenticate, authorize('ADMIN'), notificationController.deleteOldNotifications);

export default router;
