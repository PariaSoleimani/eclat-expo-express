import { findAddressById } from '#repositories/addresses.js';
import { createOrderFromCart, findOrderById, findOrderItems, findOrdersByUserId } from '#repositories/orders.js';
import { HttpError } from '#utils/error.js';
import { sendSuccess } from '#utils/response.js';
import { isUuid } from '#utils/validation.js';

const formatShippingAddress = address =>
	`${address.recipient}, ${address.details}, ${address.city}, ${address.postal_code}, ${address.country}`;

const buildOrderDetail = async (userId, orderId) => {
	const order = await findOrderById(userId, orderId);

	if (!order) {
		return null;
	}

	const items = await findOrderItems(order.id);
	const total = items.reduce((sum, item) => sum + Number(item.line_total), 0);

	return {
		...order,
		item_count: items.reduce((sum, item) => sum + item.quantity, 0),
		total,
		items,
	};
};

export const getOrders = async (req, res) => {
	res.set('Cache-Control', 'no-store');

	const orders = await findOrdersByUserId(req.auth.userId);
	return sendSuccess(res, orders);
};

export const getOrderById = async (req, res) => {
	res.set('Cache-Control', 'no-store');

	if (!isUuid(req.params.id)) {
		throw new HttpError(404, 'Order not found.');
	}

	const order = await buildOrderDetail(req.auth.userId, req.params.id);

	if (!order) {
		throw new HttpError(404, 'Order not found.');
	}

	return sendSuccess(res, order);
};

export const createOrder = async (req, res) => {
	res.set('Cache-Control', 'no-store');

	const addressId = typeof req.body?.addressId === 'string' ? req.body.addressId.trim() : '';
	const shippingAddressInput =
		typeof req.body?.shippingAddress === 'string' ? req.body.shippingAddress.trim() : '';

	if (!addressId && !shippingAddressInput) {
		throw new HttpError(400, 'Provide addressId or shippingAddress.');
	}

	if (addressId && shippingAddressInput) {
		throw new HttpError(400, 'Provide either addressId or shippingAddress, not both.');
	}

	let shippingAddress = shippingAddressInput;

	if (addressId) {
		if (!isUuid(addressId)) {
			throw new HttpError(400, 'A valid addressId is required.');
		}

		const address = await findAddressById(req.auth.userId, addressId);

		if (!address) {
			throw new HttpError(404, 'Address not found.');
		}

		shippingAddress = formatShippingAddress(address);
	}

	const order = await createOrderFromCart(req.auth.userId, shippingAddress);
	const detail = await buildOrderDetail(req.auth.userId, order.id);
	return sendSuccess(res, detail, 201);
};
