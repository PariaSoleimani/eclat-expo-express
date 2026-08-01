import { del, get, patch, post } from '@/lib/requests';

export const getCart = token => get('/api/v1/cart', { token });

export const addCartItem = (token, { variantId, quantity = 1 }) =>
	post('/api/v1/cart/items', { variantId, quantity }, { token });

export const updateCartItem = (token, itemId, { quantity }) =>
	patch(`/api/v1/cart/items/${itemId}`, { quantity }, { token });

export const removeCartItem = (token, itemId) => del(`/api/v1/cart/items/${itemId}`, { token });
