import { del, get, patch, post } from '@/lib/requests';

export const getAddresses = token => get('/api/v1/addresses', { token });

export const createAddress = (token, address) => post('/api/v1/addresses', address, { token });

export const updateAddress = (token, id, updates) =>
	patch(`/api/v1/addresses/${id}`, updates, { token });

export const deleteAddress = (token, id) => del(`/api/v1/addresses/${id}`, { token });
