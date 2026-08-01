import express from 'express';
import { getBanners } from '#controllers/banners.js';

const router = express.Router();

router.get('/', getBanners);

export default router;
