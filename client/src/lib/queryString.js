export const buildQueryString = params => {
	const search = new URLSearchParams();

	for (const [key, value] of Object.entries(params)) {
		if (value === undefined || value === null || value === '') {
			continue;
		}

		if (Array.isArray(value)) {
			for (const entry of value) {
				search.append(key, String(entry));
			}
			continue;
		}

		search.set(key, String(value));
	}

	const query = search.toString();
	return query ? `?${query}` : '';
};
