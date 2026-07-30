import express from 'express';
import authRoutes from '#routes/auth.js';
import blogPostRoutes from '#routes/blog-posts.js';
import healthRoute from '#routes/health.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/health', healthRoute);
router.use('/blog-posts', blogPostRoutes);

export default router;
