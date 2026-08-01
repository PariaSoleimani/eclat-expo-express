import jwt from 'jsonwebtoken';

const getSecret = () => {
	const secret = process.env.JWT_SECRET;

	if (!secret) {
		throw new Error('JWT_SECRET is not configured.');
	}

	return secret;
};

export const signToken = user =>
	jwt.sign(
		{
			sub: user.id,
			isAdmin: user.is_admin,
		},
		getSecret(),
		{
			expiresIn: process.env.JWT_EXPIRES_IN || '7d',
		},
	);

export const verifyToken = token => jwt.verify(token, getSecret());
