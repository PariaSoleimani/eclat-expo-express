import { findAllProductTypes } from '#repositories/productTypes.js';
import { sendSuccess } from '#utils/response.js';

export const getProductTypes = async (_req, res) => {
	res.set('Cache-Control', 'max-age=300');

	const productTypes = await findAllProductTypes();
	return sendSuccess(res, productTypes);
};
