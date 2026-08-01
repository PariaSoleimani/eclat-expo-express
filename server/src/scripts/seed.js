import database from '#database/client.js';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SEED_PATH = path.join(__dirname, '../database/seeds/seed.json');

const TABLES_IN_ORDER = [
	'users',
	'addresses',
	'categories',
	'colors',
	'product_types',
	'materials',
	'banners',
	'blog_posts',
	'products',
	'product_categories',
	'product_materials',
	'product_images',
	'product_variants',
	'wishlists',
	'wishlist_items',
	'carts',
	'cart_items',
	'orders',
	'order_items',
];

async function insertRows(client, table, rows) {
	if (!rows?.length) {
		return 0;
	}

	const columns = [...new Set(rows.flatMap(row => Object.keys(row)))];
	const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');
	const text = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;

	for (const row of rows) {
		const values = columns.map(column => {
			const value = row[column];
			return Array.isArray(value) ? JSON.stringify(value) : value;
		});
		await client.query(text, values);
	}

	return rows.length;
}

async function seed() {
	const data = JSON.parse(fs.readFileSync(SEED_PATH, 'utf8'));
	const client = await database.connect();

	try {
		console.log('Connected to database.');
		await client.query('BEGIN');

		await client.query(`TRUNCATE TABLE ${TABLES_IN_ORDER.join(', ')} RESTART IDENTITY CASCADE`);

		for (const table of TABLES_IN_ORDER) {
			const count = await insertRows(client, table, data[table]);
			if (count > 0) {
				console.log(`Seeded ${count} row(s) into ${table}.`);
			}
		}

		await client.query('COMMIT');
		console.log('Seeding completed successfully.');
	} catch (error) {
		await client.query('ROLLBACK');
		console.error('Seeding failed:', error.message);
		process.exitCode = 1;
	} finally {
		client.release();
		await database.end();
	}
}

seed();
