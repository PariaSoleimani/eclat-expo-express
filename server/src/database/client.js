import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const database = new Pool({
	connectionString: process.env.DATABASE_URL,
	max: 10,
	idleTimeoutMillis: 20_000,
	connectionTimeoutMillis: 5_000,
});

database.on('error', error => {
	console.error('Unexpected PostgreSQL pool error:', error?.message || 'Unknown error');
});

export default database;
