import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { normalizeProductListItem } from '@/lib/adapters/product';
import {
	addWishlistItem as addWishlistItemRequest,
	getWishlist as getWishlistRequest,
	removeWishlistItem as removeWishlistItemRequest,
} from '@/services/wishlist';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
	const { token, isAuthenticated } = useAuth();
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const productIds = useMemo(() => new Set(products.map(product => product.id)), [products]);

	const refetch = useCallback(async () => {
		if (!token) {
			setProducts([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const data = await getWishlistRequest(token);
			setProducts(data.map(normalizeProductListItem));
		} catch (requestError) {
			setError(requestError.message);
		} finally {
			setIsLoading(false);
		}
	}, [token]);

	useEffect(() => {
		if (!isAuthenticated || !token) {
			setProducts([]);
			setError(null);
			return;
		}

		refetch();
	}, [isAuthenticated, token, refetch]);

	const isWishlisted = useCallback(productId => productIds.has(productId), [productIds]);

	const toggleWishlist = useCallback(
		async productId => {
			if (!token) {
				throw new Error('You must be signed in to save items to your wishlist.');
			}

			setError(null);

			try {
				if (productIds.has(productId)) {
					await removeWishlistItemRequest(token, productId);
					setProducts(currentProducts => currentProducts.filter(product => product.id !== productId));
					return;
				}

				const product = await addWishlistItemRequest(token, { productId });
				const normalizedProduct = normalizeProductListItem(product);

				setProducts(currentProducts =>
					currentProducts.some(currentProduct => currentProduct.id === normalizedProduct.id)
						? currentProducts
						: [normalizedProduct, ...currentProducts],
				);

				return normalizedProduct;
			} catch (requestError) {
				setError(requestError.message);
				throw requestError;
			}
		},
		[productIds, token],
	);

	const value = useMemo(
		() => ({
			products,
			isLoading,
			error,
			refetch,
			isWishlisted,
			toggleWishlist,
		}),
		[products, isLoading, error, refetch, isWishlisted, toggleWishlist],
	);

	return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => {
	const context = useContext(WishlistContext);

	if (!context) {
		throw new Error('useWishlist must be used within WishlistProvider.');
	}

	return context;
};
