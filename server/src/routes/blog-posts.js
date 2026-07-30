import express from 'express';
import { getBlogPostBySlug, getBlogPosts } from '#controllers/blogPosts.js';

const router = express.Router();

router.get('/', getBlogPosts);
router.get('/:slug', getBlogPostBySlug);

export default router;
