import express from 'express';
import { getMe, login, signup } from '#controllers/auth.js';
import authorizeUser from '#middleware/authorizer.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authorizeUser, getMe);

export default router;
