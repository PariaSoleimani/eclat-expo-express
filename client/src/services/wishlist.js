import { del, get, post } from '@/lib/requests';

export const getWishlist = token => get('/api/v1/wishlist', { token });

export const addWishlistItem = (token, { productId }) =>
	post('/api/v1/wishlist/items', { productId }, { token });

export const removeWishlistItem = (token, productId) =>
	del(`/api/v1/wishlist/items/${productId}`, { token });
