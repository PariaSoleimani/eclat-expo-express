import database from '#database/client.js';

const routes = app => {
	app.get('/api/health', async (_req, res) => {
		try {
			await database.query('SELECT 1');
			return res.status(200).json({
				status: 'ok',
				database: 'connected',
			});
		} catch {
			return res.status(503).json({
				status: 'unavailable',
				database: 'disconnected',
			});
		}
	});
};

export default routes;
