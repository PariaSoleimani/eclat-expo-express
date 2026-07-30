import express from 'express';
import database from '#database/client.js';

const router = express.Router();

router.get('/', async (_req, res) => {
	res.set('Cache-Control', 'no-store');

	try {
		await database.query('SELECT 1');
		return res.status(200).json({
			status: 'ok',
			database: 'connected',
		});
	} catch (error) {
		return res.status(503).json({
			status: 'unavailable',
			database: 'disconnected',
			error: error?.message || 'Unknown error',
		});
	}
});

export default router;
