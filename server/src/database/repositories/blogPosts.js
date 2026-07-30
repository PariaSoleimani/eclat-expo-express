import database from '#database/client.js';

export const findAllBlogPosts = async () => {
	const { rows } = await database.query(`
		SELECT
			id,
			slug,
			title,
			excerpt,
			url,
			category,
			read_time
		FROM blog_posts
		ORDER BY created_at DESC
	`);

	return rows;
};

export const findBlogPostBySlug = async slug => {
	const { rows } = await database.query(
		`
			SELECT
				id,
				slug,
				title,
				excerpt,
				url,
				category,
				content,
				read_time,
				created_at
			FROM blog_posts
			WHERE slug = $1
		`,
		[slug],
	);

	return rows[0] ?? null;
};
