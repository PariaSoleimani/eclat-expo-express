import {
	countAddressesByUserId,
	deleteAddress,
	findAddressById,
	findAddressesByUserId,
	insertAddress,
	updateAddress,
} from '#repositories/addresses.js';
import { HttpError } from '#utils/error.js';
import { sendSuccess } from '#utils/response.js';
import { isUuid } from '#utils/validation.js';
import { parseBoolean, requireText } from '#utils/validation.js';

const parseAddressBody = (body, { partial = false } = {}) => {
	const label = body?.label;
	const recipient = body?.recipient;
	const country = body?.country;
	const city = body?.city;
	const details = body?.details;
	const postalCode = body?.postalCode;
	const isDefault = parseBoolean(body?.isDefault, 'isDefault');

	if (!partial) {
		return {
			label: requireText(label, 'label'),
			recipient: requireText(recipient, 'recipient'),
			country: requireText(country, 'country'),
			city: requireText(city, 'city'),
			details: requireText(details, 'details'),
			postalCode: requireText(postalCode, 'postalCode'),
			isDefault: isDefault ?? false,
		};
	}

	const updates = {};

	if (label !== undefined) updates.label = requireText(label, 'label');
	if (recipient !== undefined) updates.recipient = requireText(recipient, 'recipient');
	if (country !== undefined) updates.country = requireText(country, 'country');
	if (city !== undefined) updates.city = requireText(city, 'city');
	if (details !== undefined) updates.details = requireText(details, 'details');
	if (postalCode !== undefined) updates.postalCode = requireText(postalCode, 'postalCode');
	if (isDefault !== undefined) updates.isDefault = isDefault;

	if (Object.keys(updates).length === 0) {
		throw new HttpError(400, 'Provide at least one field to update.');
	}

	return updates;
};

const listAddresses = async userId => findAddressesByUserId(userId);

export const getAddresses = async (req, res) => {
	res.set('Cache-Control', 'no-store');

	const addresses = await listAddresses(req.auth.userId);
	return sendSuccess(res, addresses);
};

export const createAddress = async (req, res) => {
	res.set('Cache-Control', 'no-store');

	const address = parseAddressBody(req.body);
	const count = await countAddressesByUserId(req.auth.userId);

	if (count === 0) {
		address.isDefault = true;
	}

	await insertAddress(req.auth.userId, address);
	const addresses = await listAddresses(req.auth.userId);
	return sendSuccess(res, addresses, 201);
};

export const updateAddressById = async (req, res) => {
	res.set('Cache-Control', 'no-store');

	if (!isUuid(req.params.id)) {
		throw new HttpError(404, 'Address not found.');
	}

	const existing = await findAddressById(req.auth.userId, req.params.id);

	if (!existing) {
		throw new HttpError(404, 'Address not found.');
	}

	const updates = parseAddressBody(req.body, { partial: true });

	if (existing.is_default && updates.isDefault === false) {
		throw new HttpError(400, 'Set another address as default instead of unsetting this one.');
	}

	await updateAddress(req.auth.userId, req.params.id, updates);
	const addresses = await listAddresses(req.auth.userId);
	return sendSuccess(res, addresses);
};

export const removeAddress = async (req, res) => {
	res.set('Cache-Control', 'no-store');

	if (!isUuid(req.params.id)) {
		throw new HttpError(404, 'Address not found.');
	}

	const deleted = await deleteAddress(req.auth.userId, req.params.id);

	if (!deleted) {
		throw new HttpError(404, 'Address not found.');
	}

	const addresses = await listAddresses(req.auth.userId);
	return sendSuccess(res, addresses);
};
