import { useCallback, useEffect, useState } from 'react';
import { normalizeProductDetail } from '@/lib/adapters/product';
import { getProductById } from '@/services/products';

const useProduct = id => {
	const [product, setProduct] = useState(null);
	const [isLoading, setIsLoading] = useState(Boolean(id));
	const [error, setError] = useState(null);

	const refetch = useCallback(async () => {
		if (!id) {
			setProduct(null);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const data = await getProductById(id);
			setProduct(normalizeProductDetail(data));
		} catch (requestError) {
			setProduct(null);
			setError(requestError.message);
		} finally {
			setIsLoading(false);
		}
	}, [id]);

	useEffect(() => {
		refetch();
	}, [refetch]);

	return {
		product,
		isLoading,
		error,
		refetch,
	};
};

export default useProduct;
