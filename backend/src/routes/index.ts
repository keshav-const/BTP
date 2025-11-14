import { Router } from 'express';
import authRoutes from './auth';
import productRoutes from './products';
import orderRoutes from './orders';
import wishlistRoutes from './wishlist';
import healthRoutes from './health';
import aiRoutes from './ai';

const router = Router();

// API routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/ai', aiRoutes);

export default router;