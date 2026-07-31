import { HttpError } from '#utils/error.js';

export const requireText = (value, field) => {
	const text = typeof value === 'string' ? value.trim() : '';

	if (!text) {
		throw new HttpError(400, `${field} is required.`);
	}

	return text;
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

	return audience;
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
	if (typeof value === 'string') {
		const parsed = Number(value);

		if (Number.isNaN(parsed)) {
			return '';
		}

		return parsed;
	}

	return '';
};

export const normalizePhoneNumber = phone => {
	if (typeof phone !== 'string') {
		return '';
	}

	const digits = phone.replace(/\D/g, '');
	return digits ? `+${digits}` : '';
};

export const isValidPhoneNumber = phone => /^\+\d{10,15}$/.test(phone);
