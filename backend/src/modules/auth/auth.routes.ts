import { Router } from 'express';
import * as authController from './auth.controller';
import { authenticate } from '../../core/auth/authMiddleware';

const router = Router();

// Public
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected
router.post('/logout', authenticate, authController.logout);
router.post('/logout-all', authenticate, authController.logoutAll);
router.post('/change-password', authenticate, authController.changePassword);
router.get('/me', authenticate, authController.getCurrentUser);

export default router;
