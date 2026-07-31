import bcrypt from 'bcrypt';
import { createUser, findUserById, findUserIdByPhone } from '#repositories/users.js';
import { HttpError } from '#utils/error.js';
import { signToken } from '#utils/jwt.js';
import { sendSuccess } from '#utils/response.js';
import { isValidPhoneNumber, normalizePhoneNumber } from '#utils/validation.js';

const MIN_PASSWORD_LENGTH = 6;
const BCRYPT_ROUNDS = 10;

const authData = user => ({
	token: signToken(user),
	user,
});

export const signup = async (req, res) => {
	const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
	const phone = normalizePhoneNumber(req.body?.phone);
	const password = typeof req.body?.password === 'string' ? req.body.password : '';

	if (!name) {
		throw new HttpError(400, 'Enter a name.');
	}

	if (!isValidPhoneNumber(phone)) {
		throw new HttpError(400, 'Enter a valid phone number.');
	}

	if (password.length < MIN_PASSWORD_LENGTH) {
		throw new HttpError(400, `Enter a password with at least ${MIN_PASSWORD_LENGTH} characters.`);
	}

	const existing = await findUserIdByPhone(phone);

	if (existing) {
		throw new HttpError(409, 'An account with this phone number already exists.');
	}

	const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
	const user = await createUser({
		name,
		phone,
		passwordHash: hashedPassword,
	});

	return sendSuccess(res, authData(user), 201);
};

export const login = async (req, res) => {
	const phone = normalizePhoneNumber(req.body?.phone);
	const password = typeof req.body?.password === 'string' ? req.body.password : '';

	if (!isValidPhoneNumber(phone) || !password) {
		throw new HttpError(400, 'Enter a valid phone number and password.');
	}

	const existing = await findUserIdByPhone(phone);

	if (!existing) {
		throw new HttpError(404, 'No account found with this phone number.');
	}

	const user = await findUserById(existing.id);

	const isMatch = await bcrypt.compare(password, user.password_hash);

	if (!isMatch) {
		throw new HttpError(401, 'Invalid password.');
	}

	return sendSuccess(res, authData(user));
};

export const getMe = async (req, res) => {
	const user = await findUserById(req.auth.userId);

	if (!user) {
		throw new HttpError(401, 'Invalid or expired token.');
	}

	return sendSuccess(res, user);
};
