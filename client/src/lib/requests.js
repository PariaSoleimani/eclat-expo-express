const API_URL = process.env.EXPO_PUBLIC_API_URL;

const request = async (method, path, { body, token } = {}) => {
	if (!API_URL) {
		throw new Error('EXPO_PUBLIC_API_URL is not configured.');
	}

	const headers = {};

	if (body !== undefined) {
		headers['Content-Type'] = 'application/json';
	}

	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	const response = await fetch(`${API_URL}${path}`, {
		method,
		headers,
		body: body !== undefined ? JSON.stringify(body) : undefined,
	});
	
	const payload = await response.json().catch(() => null);

	if (!response.ok) {
		const error = new Error(payload?.message || 'Request failed.');
		error.status = response.status;
		throw error;
	}

	return payload.data;
};

export const get = (path, options = {}) => request('GET', path, options);

export const post = (path, body, options = {}) => request('POST', path, { ...options, body });

export const patch = (path, body, options = {}) => request('PATCH', path, { ...options, body });

export const del = (path, options = {}) => request('DELETE', path, options);
