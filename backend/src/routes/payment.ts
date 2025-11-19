import { Router } from 'express';
import { checkoutController } from '@/controllers';
import { validateRequest, schemas, authenticate } from '@/middlewares';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Payment routes
router.post(
  '/razorpay',
  validateRequest(schemas.payment),
  checkoutController.processPayment
);

export default router;
