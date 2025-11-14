import { Router } from 'express';
import { aiController } from '@/controllers';
import { authenticate, authorize } from '@/middlewares';

const router = Router();

router.post('/search', aiController.searchIntent);
router.post('/generate-description', authenticate, authorize('admin'), aiController.generateDescription);
router.post('/enhance-image', authenticate, authorize('admin'), aiController.enhanceImage);

export default router;
