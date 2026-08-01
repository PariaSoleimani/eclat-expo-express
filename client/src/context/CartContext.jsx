import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { emptyCart, normalizeCart } from '@/lib/adapters/cart';
import { useAuth } from '@/context/AuthContext';
import {
	addCartItem as addCartItemRequest,
	getCart as getCartRequest,
	removeCartItem as removeCartItemRequest,
	updateCartItem as updateCartItemRequest,
} from '@/services/cart';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
	const { token, isAuthenticated } = useAuth();
	const [cart, setCart] = useState(emptyCart());
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const refetch = useCallback(async () => {
		if (!token) {
			setCart(emptyCart());
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const data = await getCartRequest(token);
			setCart(normalizeCart(data));
		} catch (requestError) {
			setError(requestError.message);
		} finally {
			setIsLoading(false);
		}
	}, [token]);

	useEffect(() => {
		if (!isAuthenticated || !token) {
			setCart(emptyCart());
			setError(null);
			return;
		}

		refetch();
	}, [isAuthenticated, token, refetch]);

	const addItem = useCallback(
		async ({ variantId, quantity = 1 }) => {
			if (!token) {
				throw new Error('You must be signed in to add items to your bag.');
			}

			setError(null);

			try {
				const data = await addCartItemRequest(token, { variantId, quantity });
				const nextCart = normalizeCart(data);
				setCart(nextCart);
				return nextCart;
			} catch (requestError) {
				setError(requestError.message);
				throw requestError;
			}
		},
		[token],
	);

	const updateItem = useCallback(
		async (itemId, quantity) => {
			if (!token) {
				throw new Error('You must be signed in to update your bag.');
			}

			setError(null);

			try {
				const data = await updateCartItemRequest(token, itemId, { quantity });
				const nextCart = normalizeCart(data);
				setCart(nextCart);
				return nextCart;
			} catch (requestError) {
				setError(requestError.message);
				throw requestError;
			}
		},
		[token],
	);

	const removeItem = useCallback(
		async itemId => {
			if (!token) {
				throw new Error('You must be signed in to update your bag.');
			}

			setError(null);

			try {
				const data = await removeCartItemRequest(token, itemId);
				const nextCart = normalizeCart(data);
				setCart(nextCart);
				return nextCart;
			} catch (requestError) {
				setError(requestError.message);
				throw requestError;
			}
		},
		[token],
	);

	const value = useMemo(
		() => ({
			cart,
			itemCount: cart.itemCount,
			isLoading,
			error,
			refetch,
			addItem,
			updateItem,
			removeItem,
		}),
		[cart, isLoading, error, refetch, addItem, updateItem, removeItem],
	);

	return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
	const context = useContext(CartContext);

	if (!context) {
		throw new Error('useCart must be used within CartProvider.');
	}

	return context;
};
