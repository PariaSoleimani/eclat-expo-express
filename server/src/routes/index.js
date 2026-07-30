import express from 'express';
import authRoutes from '#routes/auth.js';
import blogPostRoutes from '#routes/blog-posts.js';
import healthRoute from '#routes/health.js';

const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/health', healthRoute);
apiRouter.use('/blog-posts', blogPostRoutes);

export default apiRouter;
