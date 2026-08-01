import { HttpError } from '#utils/error.js';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export const isUuid = value => typeof value === 'string' && UUID_PATTERN.test(value);

export const requireText = (value, field) => {
	const text = typeof value === 'string' ? value.trim() : '';

	if (!text) {
		throw new HttpError(400, `${field} is required.`);
	}

	return text;
};

export const normalizeQuantity = value => {
	const quantity = Number(value);

	if (!Number.isInteger(quantity) || quantity < 1) {
		throw new HttpError(400, 'Quantity must be a positive integer.');
	}

	return quantity;
};


export const parseBoolean = (value, field) => {
	if (value === undefined) {
		return undefined;
	}

	if (typeof value === 'boolean') {
		return value;
	}

	throw new HttpError(400, `${field} must be a boolean.`);
};

export const normalizeAudience = value => {
	if (!value) {
		return [];
	}

	if (typeof value === 'string') {
		const trimmed = value.trim();
		return trimmed ? [trimmed] : [];
	}

	if (Array.isArray(value)) {
		return value
			.filter(v => v && typeof v === 'string')
			.map(v => v.trim())
			.filter(v => v.length > 0);
	}

	return [];
};

export const normalizeQuery = value => {
	if (!value) {
		return [];
	}

	if (typeof value === 'string') {
		const trimmed = value.trim().toLowerCase();
		return trimmed ? [trimmed] : [];
	}

	if (Array.isArray(value)) {
		return value
			.filter(v => v && typeof v === 'string')
			.map(v => v.trim().toLowerCase())
			.filter(v => v.length > 0);
	}

	return [];
};

export const normalizeSearchQuery = value => {
	if (!value) {
		return '';
	}

	if (typeof value === 'string') {
		return value.trim().toLowerCase();
	}

	return '';
};

export const normalizeNumberQuery = value => {
	if (!value) {
		return undefined;
	}

	const parsed = Number(value);

	if (Number.isNaN(parsed)) {
		return undefined;
	}

	return parsed;
};

export const normalizePhoneNumber = phone => {
	if (typeof phone !== 'string') {
		return '';
	}

	const digits = phone.replace(/\D/g, '');
	return digits ? `+${digits}` : '';
};

export const isValidPhoneNumber = phone => /^\+\d{10,15}$/.test(phone);