import express from 'express';
import addressRoutes from '#routes/addresses.js';
import adminRoutes from '#routes/admin.js';
import authRoutes from '#routes/auth.js';
import bannerRoutes from '#routes/banners.js';
import blogPostRoutes from '#routes/blog-posts.js';
import cartRoutes from '#routes/cart.js';
import categoryRoutes from '#routes/categories.js';
import colorRoutes from '#routes/colors.js';
import healthRoute from '#routes/health.js';
import materialRoutes from '#routes/materials.js';
import orderRoutes from '#routes/orders.js';
import productTypeRoutes from '#routes/product-types.js';
import productRoutes from '#routes/products.js';
import wishlistRoutes from '#routes/wishlist.js';

const router = express.Router();

router.use('/health', healthRoute);
router.use('/colors', colorRoutes);
router.use('/materials', materialRoutes);
router.use('/banners', bannerRoutes);
router.use('/blog-posts', blogPostRoutes);
router.use('/categories', categoryRoutes);
router.use('/product-types', productTypeRoutes);
router.use('/auth', authRoutes);
router.use('/products', productRoutes);

router.use('/wishlist', wishlistRoutes);
router.use('/admin', adminRoutes);
router.use('/addresses', addressRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);

export default router;
