import { Router } from 'express';
import { wishlistController } from '@/controllers';
import { validateRequest, authenticate, schemas } from '@/middlewares';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', wishlistController.getWishlist);
router.post('/', validateRequest(schemas.wishlistAdd), wishlistController.addToWishlist);
router.delete('/:itemId', wishlistController.removeFromWishlist);
router.delete('/', wishlistController.clearWishlist);

export default router;