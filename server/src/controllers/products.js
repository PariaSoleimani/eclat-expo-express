import {
	findProductById,
	findProductCategories,
	findProductImages,
	findProductMaterials,
	findProducts,
	findProductVariants,
} from '#repositories/products.js';
import { HttpError } from '#utils/error.js';
import { sendSuccess } from '#utils/response.js';
import { isUuid, normalizeNumberQuery, normalizeQuery, normalizeSearchQuery } from '#utils/validation.js';

export const getProducts = async (req, res) => {
	res.set('Cache-Control', 'max-age=60');

	const audience = normalizeQuery(req.query.audience);
	const productType = normalizeQuery(req.query.productType);
	const category = normalizeQuery(req.query.category);
	const color = normalizeQuery(req.query.color);
	const search = normalizeSearchQuery(req.query.search);
	const minPrice = normalizeNumberQuery(req.query.minPrice);
	const maxPrice = normalizeNumberQuery(req.query.maxPrice);

	const products = await findProducts({
		audience,
		productType,
		category,
		color,
		minPrice,
		maxPrice,
		search,
	});

	return sendSuccess(res, products);
};

export const getProductById = async (req, res) => {
	res.set('Cache-Control', 'max-age=60');

	if (!isUuid(req.params.id)) {
		throw new HttpError(404, 'Product not found.');
	}

	const product = await findProductById(req.params.id);

	if (!product) {
		throw new HttpError(404, 'Product not found.');
	}

	const [images, materials, categories, variants] = await Promise.all([
		findProductImages(product.id),
		findProductMaterials(product.id),
		findProductCategories(product.id),
		findProductVariants(product.id),
	]);

	return sendSuccess(res, {
		...product,
		images,
		materials,
		categories,
		variants,
	});
};
