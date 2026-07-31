import database from '#database/client.js';

export const findAllCategories = async () => {
	const { rows } = await database.query(`
		SELECT
			id,
			slug,
			name,
			sort_order
		FROM categories
		ORDER BY sort_order ASC
	`);

	return rows;
};
