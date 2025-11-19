import { Router } from 'express';
import authRoutes from './auth';
import productRoutes from './products';
import orderRoutes from './orders';
import cartRoutes from './cart';
import wishlistRoutes from './wishlist';
import healthRoutes from './health';
import aiRoutes from './ai';
import userRoutes from './users';
import adminRoutes from './admin';
import chatbotRoutes from './chatbot';
import checkoutRoutes from './checkout';
import paymentRoutes from './payment';

const router = Router();

// API routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/payment', paymentRoutes);
router.use('/ai', aiRoutes);
router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/', chatbotRoutes);

export default router;
