import crypto from 'node:crypto';
import database from '#database/client.js';

export const findUserIdByPhone = async phone => {
	const { rows } = await database.query('SELECT id FROM users WHERE phone = $1', [phone]);
	return rows[0] ?? null;
};

export const findUserByPhone = async phone => {
	const { rows } = await database.query(
		`
			SELECT id, name, phone, password_hash, is_admin, url, created_at
			FROM users
			WHERE phone = $1
		`,
		[phone],
	);
	return rows[0] ?? null;
};

export const findUserById = async id => {
	const { rows } = await database.query(
		`
			SELECT id, name, phone, is_admin, url, created_at
			FROM users
			WHERE id = $1
		`,
		[id],
	);
	return rows[0] ?? null;
};

export const createUser = async ({ name, phone, passwordHash }) => {
	const { rows } = await database.query(
		`
			INSERT INTO users (id, name, phone, password_hash)
			VALUES ($1, $2, $3, $4)
			RETURNING id, name, phone, is_admin, url, created_at
		`,
		[crypto.randomUUID(), name, phone, passwordHash],
	);
	return rows[0];
};
