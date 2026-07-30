import express from 'express';
import database from '#database/client.js';

const router = express.Router();

router.get('/', async (_req, res) => {
	res.set('Cache-Control', 'max-age=300');

	try {
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

		return res.status(200).json(rows);
	} catch (error) {
		console.error('Could not fetch blog posts:', error.message);

		return res.status(500).json({
			message: 'Could not fetch blog posts.',
		});
	}
});

router.get('/:slug', async (req, res) => {
	res.set('Cache-Control', 'public, max-age=300');

	try {
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
			[req.params.slug],
		);

		if (rows.length === 0) {
			return res.status(404).json({
				message: 'Blog post not found.',
			});
		}

		return res.status(200).json(rows[0]);
	} catch (error) {
		console.error('Could not fetch blog post:', error.message);

		return res.status(500).json({
			message: 'Could not fetch blog post.',
		});
	}
});

export default router;
