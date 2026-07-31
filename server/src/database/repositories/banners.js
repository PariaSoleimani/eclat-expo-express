import database from '#database/client.js';

export const findAllBanners = async () => {
	const { rows } = await database.query(`
		SELECT
			id,
			title,
			subtitle,
			url,
			sort_order
		FROM banners
		ORDER BY sort_order ASC
	`);

	return rows;
};
