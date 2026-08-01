import { get, post } from '@/lib/requests';

export const getOrders = token => get('/api/v1/orders', { token });

export const getOrderById = (token, id) => get(`/api/v1/orders/${id}`, { token });

export const createOrder = (token, { addressId, shippingAddress } = {}) =>
	post('/api/v1/orders', { addressId, shippingAddress }, { token });
