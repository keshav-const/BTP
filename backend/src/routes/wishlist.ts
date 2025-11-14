import { Router } from 'express';
import { wishlistController } from '@/controllers';
import { validateRequest, authenticate, schemas } from '@/middlewares';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', wishlistController.getWishlist);
router.post('/add', validateRequest(schemas.wishlist), wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);
router.delete('/clear', wishlistController.clearWishlist);

export default router;