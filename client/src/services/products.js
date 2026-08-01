import { buildQueryString } from '@/lib/queryString';
import { get } from '@/lib/requests';

export const getProducts = filters => get(`/api/v1/products${buildQueryString(filters)}`);

export const getProductById = id => get(`/api/v1/products/${id}`);
