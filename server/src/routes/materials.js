import express from 'express';
import { getMaterials } from '#controllers/materials.js';

const router = express.Router();

router.get('/', getMaterials);

export default router;
