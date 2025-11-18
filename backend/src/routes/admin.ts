import { Router } from 'express';
import { orderController, adminController } from '@/controllers';
import { authenticate, authorize, validateQuery, schemas } from '@/middlewares';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/analytics/summary', adminController.getDashboardSummary);
router.get('/orders', validateQuery(schemas.pagination), orderController.getOrders);
router.get('/orders/:id', orderController.getOrderById);
router.put('/orders/:id', orderController.updateOrderStatus);

// Product seeding routes
router.post('/seed/products', adminController.seedProducts);
router.delete('/seed/products', adminController.clearProducts);

export default router;
