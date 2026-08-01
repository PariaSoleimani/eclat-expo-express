import { findActiveProductId, findProductById } from '#repositories/products.js';
import {
	createWishlist,
	createWishlistItem,
	deleteWishlistItemByProductId,
	findWishlistByUserId,
	findWishlistItemByProductId,
	findWishlistItemIds,
} from '#repositories/wishlist.js';
import { HttpError } from '#utils/error.js';
import { sendSuccess } from '#utils/response.js';
import { isUuid } from '#utils/validation.js';

export const getWishlist = async (req, res) => {
	res.set('Cache-Control', 'no-store');

	const wishlist = await findWishlistByUserId(req.auth.userId);
	const itemIds = wishlist ? await findWishlistItemIds(wishlist.id) : [];

	const wishlistItems = await Promise.all(itemIds.map(itemId => findProductById(itemId.product_id)).filter(Boolean));

	return sendSuccess(res, wishlistItems);
};

export const addWishlistItem = async (req, res) => {
	res.set('Cache-Control', 'no-store');

	const productId = typeof req.body?.productId === 'string' ? req.body.productId.trim() : '';

	if (!isUuid(productId)) {
		throw new HttpError(400, 'A valid productId is required.');
	}

	const activeProductId = await findActiveProductId(productId);

	if (!activeProductId) {
		throw new HttpError(404, 'Product not found.');
	}

	let wishlist = await findWishlistByUserId(req.auth.userId);

	if (!wishlist) {
		wishlist = await createWishlist(req.auth.userId);
	}

	const existing = await findWishlistItemByProductId(wishlist.id, productId);

	if (!existing) {
		await createWishlistItem(wishlist.id, productId);
	}

	const item = await findProductById(productId);
	return sendSuccess(res, item, existing ? 200 : 201);
};

export const removeWishlistItem = async (req, res) => {
	res.set('Cache-Control', 'no-store');

	if (!isUuid(req.params.productId)) {
		throw new HttpError(404, 'Wishlist item not found.');
	}

	const wishlist = await findWishlistByUserId(req.auth.userId);

	if (!wishlist) {
		throw new HttpError(404, 'Wishlist item not found.');
	}

	const deleted = await deleteWishlistItemByProductId(wishlist.id, req.params.productId);

	if (!deleted) {
		throw new HttpError(404, 'Wishlist item not found.');
	}

	return sendSuccess(res, deleted);
};
