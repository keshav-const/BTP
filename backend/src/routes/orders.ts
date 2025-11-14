import { Router } from 'express';
import { orderController } from '@/controllers';
import { validateRequest, validateQuery, schemas, authenticate, authorize } from '@/middlewares';

const router = Router();

// All routes require authentication
router.use(authenticate);

// User and Admin routes
router.get('/', validateQuery(schemas.pagination), orderController.getOrders);
router.get('/user/:userId', validateQuery(schemas.pagination), orderController.getOrdersByUser);
router.get('/:id', orderController.getOrderById);

// User only routes
router.post(
  '/',
  validateRequest(schemas.order),
  orderController.createOrder
);

router.delete('/:id/cancel', orderController.cancelOrder);

// Admin only routes
router.put(
  '/:id/status',
  authorize('admin'),
  orderController.updateOrderStatus
);

export default router;