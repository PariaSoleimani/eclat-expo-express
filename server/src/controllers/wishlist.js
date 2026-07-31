import {
	deleteWishlistItemByProduct,
	findActiveProductId,
	findWishlistByUserId,
	findWishlistItemByProductId,
	findWishlistItems,
	insertWishlist,
	insertWishlistItem,
} from '#repositories/wishlist.js';
import { HttpError } from '#utils/error.js';
import { sendSuccess } from '#utils/response.js';
import { isUuid } from '#utils/validation.js';

export const getWishlist = async (req, res) => {
	res.set('Cache-Control', 'no-store');

	const wishlist = await findWishlistByUserId(req.auth.userId);
	const items = wishlist ? await findWishlistItems(wishlist.id) : [];

	return sendSuccess(res, items);
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
		wishlist = await insertWishlist(req.auth.userId);
	}

	const existing = await findWishlistItemByProductId(wishlist.id, productId);

	if (!existing) {
		await insertWishlistItem(wishlist.id, productId);
	}

	const items = await findWishlistItems(wishlist.id);
	return sendSuccess(res, items, existing ? 200 : 201);
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

	const deleted = await deleteWishlistItemByProduct(wishlist.id, req.params.productId);

	if (!deleted) {
		throw new HttpError(404, 'Wishlist item not found.');
	}

	const items = await findWishlistItems(wishlist.id);
	return sendSuccess(res, items);
};
