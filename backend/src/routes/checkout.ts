import { Router } from 'express';
import { checkoutController } from '@/controllers';
import { validateRequest, schemas, authenticate } from '@/middlewares';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Checkout routes
router.post(
  '/',
  validateRequest(schemas.checkout),
  checkoutController.createCheckout
);

router.get(
  '/:orderId',
  checkoutController.getOrderConfirmation
);

export default router;
