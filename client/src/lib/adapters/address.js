export const normalizeAddress = address => ({
	id: address.id,
	label: address.label,
	recipient: address.recipient,
	country: address.country,
	city: address.city,
	details: address.details,
	line1: address.details,
	line2: null,
	postalCode: address.postal_code,
	isDefault: address.is_default,
});

export const normalizeAddresses = addresses => addresses.map(normalizeAddress);
