import database from '#database/client.js';

export const findAllProductTypes = async () => {
	const { rows } = await database.query(`
		SELECT
			id,
			slug,
			name
		FROM product_types
		ORDER BY name ASC
	`);

	return rows;
};
