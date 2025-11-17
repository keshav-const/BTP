import { Router } from 'express';

import { cartController } from '@/controllers';
import { authenticate, validateRequest, schemas } from '@/middlewares';

const router = Router();

router.use(authenticate);

router.get('/', cartController.getCart);
router.post('/', validateRequest(schemas.cartAdd), cartController.addToCart);
router.patch('/:itemId', validateRequest(schemas.cartUpdate), cartController.updateCartItem);
router.delete('/:itemId', cartController.removeCartItem);
router.delete('/', cartController.clearCart);

export default router;
