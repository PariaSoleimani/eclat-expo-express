import { useCallback, useEffect, useMemo, useState } from 'react';
import { normalizeProductListItem } from '@/lib/adapters/product';
import { getProducts } from '@/services/products';

const useProducts = (filters = {}) => {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);
	const filterKey = useMemo(() => JSON.stringify(filters), [filters]);

	const refetch = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const data = await getProducts(filters);
			setProducts(data.map(normalizeProductListItem));
		} catch (requestError) {
			setError(requestError.message);
		} finally {
			setIsLoading(false);
		}
	}, [filterKey]);

	useEffect(() => {
		refetch();
	}, [refetch]);

	return {
		products,
		isLoading,
		error,
		refetch,
	};
};

export default useProducts;
