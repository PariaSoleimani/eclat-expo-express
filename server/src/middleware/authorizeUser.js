import { HttpError } from '#utils/error.js';
import { verifyToken } from '#utils/jwt.js';

const authorizeUser = (req, _res, next) => {
	const header = req.get('authorization');

	if (!header?.startsWith('Bearer ')) {
		return next(new HttpError(401, 'Authentication required.'));
	}

	const token = header.slice('Bearer '.length).trim();

	if (!token) {
		return next(new HttpError(401, 'Authentication required.'));
	}

	try {
		const payload = verifyToken(token);
		req.auth = {
			userId: payload.sub,
			isAdmin: Boolean(payload.isAdmin),
		};
		return next();
	} catch {
		return next(new HttpError(401, 'Invalid or expired token.'));
	}
};

export default authorizeUser;
