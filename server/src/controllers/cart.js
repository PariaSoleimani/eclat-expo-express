import {
	createCart,
	deleteCartItem,
	findCartByUserId,
	findCartItemById,
	findCartItems,
	findVariantForCart,
	touchCart,
	updateCartItemQuantity,
} from '#repositories/cart.js';
import { HttpError } from '#utils/error.js';
import { sendSuccess } from '#utils/response.js';
import { isUuid, normalizeQuantity } from '#utils/validation.js';

// const buildCartResponse = async userId => {
// 	const cart = await ensureCart(userId);
// 	const items = await findCartItems(cart.id);
// 	const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
// 	const subtotal = items.reduce((sum, item) => sum + Number(item.line_total), 0);

// 	return {
// 		id: cart.id,
// 		updated_at: cart.updated_at,
// 		item_count: itemCount,
// 		subtotal,
// 		items,
// 	};
// };

export const getCart = async (req, res) => {
	res.set('Cache-Control', 'no-store');

	const cart = await findCartByUserId(req.auth.userId);
	const cartItems = cart ? await findCartItems(cart.id) : [];

	return sendSuccess(res, cartItems);
};

export const addCartItem = async (req, res) => {
	res.set('Cache-Control', 'no-store');

	const userId = req.auth.userId;
	const variantId = typeof req.body?.variantId === 'string' ? req.body.variantId.trim() : '';
	const quantity = normalizeQuantity(req.body?.quantity ?? 1);

	if (!isUuid(variantId)) {
		throw new HttpError(400, 'A valid variantId is required.');
	}

	const variant = await findVariantForCart(variantId);

	if (!variant?.is_active) {
		throw new HttpError(404, 'Variant not found.');
	}

	let cart = await findCartByUserId(userId);

	if (!cart) {
		cart = await createCart(userId);
	}

	const existing = await findCartItemByVariantId(cart.id, variantId);
	const nextQuantity = (existing?.quantity ?? 0) + quantity;

	if (nextQuantity > variant.stock) {
		throw new HttpError(400, 'Not enough stock for this variant.');
	}

	if (existing?.quantity !== nextQuantity) {
		await updateCartItemQuantity(existing.id, nextQuantity);
	} else {
		await createCartItem(cart.id, variantId, quantity);
	}

	const item = await findProductById(variant.product_id);
	return sendSuccess(res, item, existing ? 200 : 201);
};

export const updateCartItem = async (req, res) => {
	res.set('Cache-Control', 'no-store');

	if (!isUuid(req.params.id)) {
		throw new HttpError(404, 'Cart item not found.');
	}

	const quantity = normalizeQuantity(req.body?.quantity);
	const cart = await ensureCart(req.auth.userId);
	const item = await findCartItemById(cart.id, req.params.id);

	if (!item) {
		throw new HttpError(404, 'Cart item not found.');
	}

	if (quantity > item.stock) {
		throw new HttpError(400, 'Not enough stock for this variant.');
	}

	await updateCartItemQuantity(item.id, quantity);
	await touchCart(cart.id);

	const updatedCart = await buildCartResponse(req.auth.userId);
	return sendSuccess(res, updatedCart);
};

export const removeCartItem = async (req, res) => {
	res.set('Cache-Control', 'no-store');

	if (!isUuid(req.params.id)) {
		throw new HttpError(404, 'Cart item not found.');
	}

	const cart = await ensureCart(req.auth.userId);
	const deleted = await deleteCartItem(cart.id, req.params.id);

	if (!deleted) {
		throw new HttpError(404, 'Cart item not found.');
	}

	await touchCart(cart.id);

	const updatedCart = await buildCartResponse(req.auth.userId);
	return sendSuccess(res, updatedCart);
};
