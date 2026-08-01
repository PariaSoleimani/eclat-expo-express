import express from 'express';
import { getProductTypes } from '#controllers/productTypes.js';

const router = express.Router();

router.get('/', getProductTypes);

export default router;
