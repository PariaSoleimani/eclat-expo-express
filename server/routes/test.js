import database from '../database/client.js';

const routes = app => {
	app.get('/api/health', async (req, res) => {
		try {
			await database.query('SELECT 1');
			return res.status(200).json({
				status: 'ok',
				database: 'connected',
			});
		} catch (error) {
			console.error('Database health check failed.');
			
			return res.status(200).json({
				status: 'unavailable',
				database: 'disconnected',
			});
		}
	});
};

export default routes;
