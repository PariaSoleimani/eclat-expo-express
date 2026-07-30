import { verifyToken } from '#utils/jwt.js';

const requireAuth = (req, res, next) => {
	const header = req.get('authorization');

	if (!header?.startsWith('Bearer ')) {
		return res.status(401).json({
			message: 'Authentication required.',
		});
	}

	const token = header.slice('Bearer '.length).trim();

	if (!token) {
		return res.status(401).json({
			message: 'Authentication required.',
		});
	}

	try {
		const payload = verifyToken(token);
		req.auth = {
			userId: payload.sub,
			isAdmin: Boolean(payload.isAdmin),
		};
		return next();
	} catch {
		return res.status(401).json({
			message: 'Invalid or expired token.',
		});
	}
};

export default requireAuth;
