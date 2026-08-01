import { findAllCategories } from '#repositories/categories.js';
import { findProducts } from '#repositories/products.js';
import { sendSuccess } from '#utils/response.js';
import { normalizeQuery } from '#utils/validation.js';

export const getCategories = async (_req, res) => {
	res.set('Cache-Control', 'max-age=300');

	const categories = await findAllCategories();
	
	const filters = {
		category: normalizeQuery(category.slug),
	};

	const categoriesWithItems = await Promise.all(
		categories.map(async category => ({
			...category,
			items: await findProducts(filters),
		})),
	);

	return sendSuccess(res, categoriesWithItems);
};
