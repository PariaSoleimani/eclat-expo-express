import database from '#database/client.js';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(__dirname, '../database/migrations');

async function ensureMigrationsTable() {
	await database.query(`
		CREATE TABLE IF NOT EXISTS schema_migrations (
			name TEXT PRIMARY KEY,
			applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
		);
	`);
}

async function getAppliedMigrations() {
	const { rows } = await database.query('SELECT name FROM schema_migrations');
	return new Set(rows.map(row => row.name));
}

async function migrate() {
	try {
		console.log('Connecting to database...');
		await database.query('SELECT NOW()');
		console.log('Database connected.');

		await ensureMigrationsTable();
		const applied = await getAppliedMigrations();

		const pending = fs
			.readdirSync(MIGRATIONS_DIR)
			.filter(file => file.endsWith('.sql'))
			.sort()
			.filter(file => !applied.has(file));

		if (pending.length === 0) {
			console.log('No pending migrations.');
			return;
		}

		for (const file of pending) {
			console.log(`Applying migration: ${file}`);
			const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
			const client = await database.connect();

			try {
				await client.query('BEGIN');
				await client.query(sql);
				await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
				await client.query('COMMIT');
			} catch (error) {
				await client.query('ROLLBACK');
				throw error;
			} finally {
				client.release();
			}
		}

		console.log(`Applied ${pending.length} migration(s).`);
	} catch (error) {
		console.error('Migration failed:', error.message);
		process.exitCode = 1;
	} finally {
		await database.end();
	}
}

migrate();
