import { get } from '@/lib/requests';

export const getBanners = () => get('/api/v1/banners');

export const getCategories = () => get('/api/v1/categories');

export const getColors = () => get('/api/v1/colors');

export const getMaterials = () => get('/api/v1/materials');

export const getProductTypes = () => get('/api/v1/product-types');
