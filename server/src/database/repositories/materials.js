import database from '#database/client.js';

export const findAllMaterials = async () => {
	const { rows } = await database.query(`
		SELECT
			id,
			slug,
			name
		FROM materials
		ORDER BY name ASC
	`);

	return rows;
};
