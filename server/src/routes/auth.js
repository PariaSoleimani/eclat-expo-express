import express from 'express';
import { getMe, login, signup } from '#controllers/auth.js';
import requireAuth from '#middleware/requireAuth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', requireAuth, getMe);

export default router;
