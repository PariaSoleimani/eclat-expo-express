import {
	getBanners,
	getCategories,
	getColors,
	getMaterials,
	getProductTypes,
} from '@/services/catalog';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CatalogContext = createContext(null);

export const CatalogProvider = ({ children }) => {
	const [banners, setBanners] = useState([]);
	const [categories, setCategories] = useState([]);
	const [colors, setColors] = useState([]);
	const [materials, setMaterials] = useState([]);
	const [productTypes, setProductTypes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(null);

	const refetch = useCallback(async () => {
		setIsLoading(true);
		setError(null);

		try {
			const [bannersData, categoriesData, colorsData, materialsData, productTypesData] =
				await Promise.all([
					getBanners(),
					getCategories(),
					getColors(),
					getMaterials(),
					getProductTypes(),
				]);

			setBanners(bannersData);
			setCategories(categoriesData);
			setColors(colorsData);
			setMaterials(materialsData);
			setProductTypes(productTypesData);
		} catch (requestError) {
			setError(requestError.message);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		refetch();
	}, [refetch]);

	const value = useMemo(
		() => ({
			banners,
			categories,
			colors,
			materials,
			productTypes,
			jewelryTypes: productTypes,
			isLoading,
			error,
			refetch,
		}),
		[banners, categories, colors, materials, productTypes, isLoading, error, refetch],
	);

	return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
};

export const useCatalog = () => {
	const context = useContext(CatalogContext);

	if (!context) {
		throw new Error('useCatalog must be used within CatalogProvider.');
	}

	return context;
};



