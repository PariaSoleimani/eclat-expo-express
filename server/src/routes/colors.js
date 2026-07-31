import express from 'express';
import { getColors } from '#controllers/colors.js';

const router = express.Router();

router.get('/', getColors);

export default router;
