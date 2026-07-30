import database from '#database/client.js';
import requireAuth from '#middleware/requireAuth.js';
import { signToken } from '#utils/jwt.js';
import { isValidPhone, normalizePhone } from '#utils/phone.js';
import bcrypt from 'bcrypt';
import express from 'express';

const router = express.Router();
const MIN_PASSWORD_LENGTH = 6;
const BCRYPT_ROUNDS = 10;

const authResponse = user => ({
	token: signToken(user),
	user: { id: user.id, name: user.name, is_admin: user.is_admin, url: user.url },
});

router.post('/signup', async (req, res) => {
	try {
		const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
		const phone = normalizePhone(req.body?.phone);
		const password = typeof req.body?.password === 'string' ? req.body.password : '';

		if (!name) return res.status(400).json({ message: 'Enter a name.' });

		if (!isValidPhone(phone)) return res.status(400).json({ message: 'Enter a valid phone number.' });

		if (password.length < MIN_PASSWORD_LENGTH)
			return res
				.status(400)
				.json({ message: `Enter a password with at least ${MIN_PASSWORD_LENGTH} characters.` });

		const existing = await database.query('SELECT id FROM users WHERE phone = $1', [phone]);

		if (existing.rows.length > 0) {
			return res.status(409).json({
				message: 'An account with this phone number already exists.',
			});
		}

		const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
		const id = crypto.randomUUID();

		const { rows } = await database.query(
			`
			INSERT INTO users (id, name, phone, password_hash)
			VALUES ($1, $2, $3, $4)
			RETURNING id, name, phone, is_admin, url, created_at
			`,
			[id, name, phone, hashedPassword],
		);
		const user = rows[0];

		return res.status(201).json(authResponse(user));
	} catch (error) {
		console.error('Signup failed:', error.message);

		return res.status(500).json({
			message: 'Could not create account.',
		});
	}
});

router.post('/login', async (req, res) => {
	try {
		const phone = normalizePhone(req.body?.phone);
		const password = typeof req.body?.password === 'string' ? req.body.password : '';

		if (!isValidPhone(phone) || !password) {
			return res.status(400).json({
				message: 'Enter a valid phone number and password.',
			});
		}

		const { rows } = await database.query(
			`
				SELECT id, name, phone, password_hash, is_admin, url, created_at
				FROM users
				WHERE phone = $1
			`,
			[phone],
		);
		const user = rows[0];

		if (!user) {
			return res.status(401).json({
				message: 'Invalid phone number or password.',
			});
		}

		const isMatch = await bcrypt.compare(password, user.password_hash);

		if (!isMatch) {
			return res.status(401).json({
				message: 'Invalid phone number or password.',
			});
		}

		return res.status(200).json(authResponse(user));
	} catch (error) {
		console.error('Login failed:', error.message);

		return res.status(500).json({
			message: 'Could not log in.',
		});
	}
});

router.get('/me', requireAuth, async (req, res) => {
	try {
		const { rows } = await database.query(
			`
				SELECT id, name, phone, is_admin, url, created_at
				FROM users
				WHERE id = $1
			`,
			[req.auth.userId],
		);

		const user = rows[0];

		if (!user) {
			return res.status(401).json({
				message: 'Invalid or expired token.',
			});
		}

		return res.status(200).json({
			user: { id: user.id, name: user.name, phone: user.phone, is_admin: user.is_admin, url: user.url },
		});
	} catch (error) {
		console.error('Could not load current user:', error.message);

		return res.status(500).json({
			message: 'Could not load current user.',
		});
	}
});

export default router;
