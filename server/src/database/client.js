import pg from 'pg';
import 'dotenv/config';

const { Pool } = pg;

const database = new Pool({
	connectionString: process.env.DATABASE_URL,
	max: 10,
	idleTimeoutMillis: 20_000,
	connectionTimeoutMillis: 5_000,
});

// let connectionId = 0;

// database.on('connect', client => {
// 	connectionId++;
// 	const id = connectionId;
// 	client.connectionId = id;
// 	console.log(`🔵 CONNECTION #${id} CREATED`);
// 	console.log(`   📊 Pool: ${database.totalCount} total, ${database.idleCount} idle`);
// });

// database.on('acquire', client => {
// 	const id = client.connectionId || '?';
// 	console.log(`🟢 CONNECTION #${id} ACQUIRED (in use)`);
// 	console.log(`   📊 Pool: ${database.totalCount} total, ${database.idleCount} idle`);
// });

// database.on('remove', client => {
// 	const id = client.connectionId || '?';
// 	console.log(`🔴 CONNECTION #${id} REMOVED (closed)`);
// 	console.log(`   📊 Pool: ${database.totalCount} total, ${database.idleCount} idle`);
// });

database.on('error', error => {
	console.error('Unexpected PostgreSQL pool error:', error?.message || 'Unknown error');
});

export default database;
