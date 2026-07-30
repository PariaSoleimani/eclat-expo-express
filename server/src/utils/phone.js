export const normalizePhone = phone => {
	if (typeof phone !== 'string') {
		return '';
	}

	const digits = phone.replace(/\D/g, '');
	return digits ? `+${digits}` : '';
};

export const isValidPhone = phone => /^\+\d{10,15}$/.test(phone);
