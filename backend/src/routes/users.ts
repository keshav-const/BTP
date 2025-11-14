import { Router } from 'express';
import { userController } from '@/controllers';
import { authenticate, validateRequest, schemas } from '@/middlewares';

const router = Router();

router.use(authenticate);

router.get('/:userId/addresses', userController.getAddresses);
router.post(
  '/:userId/addresses',
  validateRequest(schemas.address),
  userController.createAddress
);
router.put(
  '/:userId/addresses/:addressId',
  validateRequest(schemas.addressUpdate),
  userController.updateAddress
);
router.delete('/:userId/addresses/:addressId', userController.deleteAddress);
router.put(
  '/:userId/profile',
  validateRequest(schemas.profileUpdate),
  userController.updateProfile
);

export default router;
