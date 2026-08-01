import database from '#database/client.js';

export const pingDatabase = async () => {
	await database.query('SELECT 1');
};
