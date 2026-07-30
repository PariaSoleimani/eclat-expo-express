import { pingDatabase } from '#repositories/health.js';
import { HttpError } from '#utils/error.js';
import { sendSuccess } from '#utils/response.js';

export const getHealth = async (_req, res) => {
	res.set('Cache-Control', 'no-store');

	try {
		await pingDatabase();
	} catch {
		throw new HttpError(503, 'Database unavailable.');
	}

	return sendSuccess(res, {
		status: 'ok',
		database: 'connected',
	});
};
