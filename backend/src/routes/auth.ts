import { Router } from 'express';
import { authController } from '@/controllers';
import { validateRequest, schemas, authenticate } from '@/middlewares';

const router = Router();

// Public routes
router.post('/register', validateRequest(schemas.signup), authController.signup);
router.post('/signup', validateRequest(schemas.signup), authController.signup);
router.post('/login', validateRequest(schemas.login), authController.login);
router.post('/refresh', authController.refreshToken);

// Protected routes
router.get('/profile', authenticate, authController.getProfile);
router.get('/me', authenticate, authController.getCurrentUser);

export default router;