import { findAllColors } from '#repositories/colors.js';
import { sendSuccess } from '#utils/response.js';

export const getColors = async (_req, res) => {
	res.set('Cache-Control', 'max-age=300');

	const colors = await findAllColors();
	return sendSuccess(res, colors);
};
