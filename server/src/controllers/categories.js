import { findAllCategories } from '#repositories/categories.js';
import { sendSuccess } from '#utils/response.js';

export const getCategories = async (_req, res) => {
	res.set('Cache-Control', 'max-age=300');

	const categories = await findAllCategories();
	return sendSuccess(res, categories);
};
