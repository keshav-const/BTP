import { Router } from 'express';
import { productController } from '@/controllers';
import { validateQuery, authenticate, authorize, optionalAuth, upload } from '@/middlewares';
import { config } from '@/config';
import Joi from 'joi';

const router = Router();

const productSchema = Joi.object({
  name: Joi.string().trim().min(1).max(100).required(),
  description: Joi.string().min(1).max(2000).required(),
  price: Joi.alternatives().try(Joi.number(), Joi.string()).required(),
  category: Joi.string().trim().required(),
  brand: Joi.string().trim().required(),
  stock: Joi.alternatives().try(Joi.number().integer(), Joi.string()).required(),
  images: Joi.alternatives().try(
    Joi.array().items(Joi.string().uri()),
    Joi.string()
  ).optional(),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).optional(),
  isActive: Joi.alternatives().try(Joi.boolean(), Joi.string()).optional(),
});

const validateMultipartProduct = (req: any, res: any, next: any) => {
  const { error } = productSchema.validate(req.body);
  
  if (error) {
    const errorMessage = error.details.map(detail => detail.message).join(', ');
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      error: errorMessage,
    });
  }
  
  next();
};

const productFiltersSchema = Joi.object({
  category: Joi.string().optional(),
  brand: Joi.string().optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  search: Joi.string().optional(),
  isActive: Joi.boolean().optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  sort: Joi.string().optional(),
  order: Joi.string().valid('asc', 'desc').optional(),
});

// Public routes
router.get('/', validateQuery(productFiltersSchema), optionalAuth, productController.getProducts);
router.get('/:id', optionalAuth, productController.getProductById);
router.get('/:id/recommendations', optionalAuth, productController.getRecommendations);

// Admin only routes
router.post(
  '/',
  authenticate,
  authorize('admin'),
  upload.array('images', 5),
  validateMultipartProduct,
  productController.createProduct
);

router.post(
  '/upload-images',
  authenticate,
  authorize('admin'),
  upload.array('images', 5),
  productController.uploadProductImages
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  upload.array('images', 5),
  validateMultipartProduct,
  productController.updateProduct
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  productController.deleteProduct
);

export default router;