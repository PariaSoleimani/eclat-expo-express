import { get, post } from '@/lib/requests';

export const login = async credentials => {
	const data = await post('/api/v1/auth/login', credentials);
	return data;
};

export const signup = async credentials => {
	const data = await post('/api/v1/auth/signup', credentials);
	return data;
};

export const getCurrentUser = async token => {
	const data = await get('/api/v1/auth/me', { token });
	return data;
};
