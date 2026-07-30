import express from 'express';
import blogPostRoutes from '#routes/blog-posts.js';
import healthRoute from '#routes/health.js';

const apiRouter = express.Router();

apiRouter.use('/health', healthRoute);
apiRouter.use('/blog-posts', blogPostRoutes);

export default apiRouter;
