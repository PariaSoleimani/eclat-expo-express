import database from '#database/client.js';

export const findAllColors = async () => {
	const { rows } = await database.query(`
		SELECT
			id,
			slug,
			name,
			hex
		FROM colors
		ORDER BY name ASC
	`);

	return rows;
};
