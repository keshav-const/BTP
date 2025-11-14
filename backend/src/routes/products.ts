import { Router } from 'express';
import { productController } from '@/controllers';
import { validateRequest, validateQuery, schemas, authenticate, authorize, optionalAuth } from '@/middlewares';

const router = Router();

// Public routes
router.get('/', validateQuery(schemas.productFilters), optionalAuth, productController.getProducts);
router.get('/:id', optionalAuth, productController.getProductById);

// Admin only routes
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validateRequest(schemas.product),
  productController.createProduct
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validateRequest(schemas.product),
  productController.updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  productController.deleteProduct
);

export default router;