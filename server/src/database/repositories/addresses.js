import crypto from 'node:crypto';
import database from '#database/client.js';

export const findAddressesByUserId = async userId => {
	const { rows } = await database.query(
		`
			SELECT
				id,
				label,
				recipient,
				country,
				city,
				details,
				postal_code,
				is_default
			FROM addresses
			WHERE user_id = $1
			ORDER BY is_default DESC, label ASC
		`,
		[userId],
	);

	return rows;
};

export const findAddressById = async (userId, addressId) => {
	const { rows } = await database.query(
		`
			SELECT
				id,
				label,
				recipient,
				country,
				city,
				details,
				postal_code,
				is_default
			FROM addresses
			WHERE user_id = $1 AND id = $2
		`,
		[userId, addressId],
	);

	return rows[0] ?? null;
};

export const countAddressesByUserId = async userId => {
	const { rows } = await database.query(
		`
			SELECT COUNT(*)::int AS count
			FROM addresses
			WHERE user_id = $1
		`,
		[userId],
	);

	return rows[0].count;
};

export const clearDefaultAddresses = async (userId, client = database) => {
	await client.query(
		`
			UPDATE addresses
			SET is_default = false
			WHERE user_id = $1 AND is_default = true
		`,
		[userId],
	);
};

export const insertAddress = async (userId, address) => {
	const client = await database.connect();

	try {
		await client.query('BEGIN');

		if (address.isDefault) {
			await clearDefaultAddresses(userId, client);
		}

		const { rows } = await client.query(
			`
				INSERT INTO addresses (
					id,
					user_id,
					label,
					recipient,
					country,
					city,
					details,
					postal_code,
					is_default
				)
				VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
				RETURNING
					id,
					label,
					recipient,
					country,
					city,
					details,
					postal_code,
					is_default
			`,
			[
				crypto.randomUUID(),
				userId,
				address.label,
				address.recipient,
				address.country,
				address.city,
				address.details,
				address.postalCode,
				address.isDefault,
			],
		);

		await client.query('COMMIT');
		return rows[0];
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
};

export const updateAddress = async (userId, addressId, updates) => {
	const client = await database.connect();

	try {
		await client.query('BEGIN');

		if (updates.isDefault === true) {
			await clearDefaultAddresses(userId, client);
		}

		const { rows } = await client.query(
			`
				UPDATE addresses
				SET
					label = COALESCE($3, label),
					recipient = COALESCE($4, recipient),
					country = COALESCE($5, country),
					city = COALESCE($6, city),
					details = COALESCE($7, details),
					postal_code = COALESCE($8, postal_code),
					is_default = COALESCE($9, is_default)
				WHERE user_id = $1 AND id = $2
				RETURNING
					id,
					label,
					recipient,
					country,
					city,
					details,
					postal_code,
					is_default
			`,
			[
				userId,
				addressId,
				updates.label,
				updates.recipient,
				updates.country,
				updates.city,
				updates.details,
				updates.postalCode,
				updates.isDefault,
			],
		);

		await client.query('COMMIT');
		return rows[0] ?? null;
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
};

export const deleteAddress = async (userId, addressId) => {
	const client = await database.connect();

	try {
		await client.query('BEGIN');

		const { rows } = await client.query(
			`
				DELETE FROM addresses
				WHERE user_id = $1 AND id = $2
				RETURNING id, is_default
			`,
			[userId, addressId],
		);

		const deleted = rows[0];

		if (deleted?.is_default) {
			await client.query(
				`
					UPDATE addresses
					SET is_default = true
					WHERE id = (
						SELECT id
						FROM addresses
						WHERE user_id = $1
						ORDER BY label ASC
						LIMIT 1
					)
				`,
				[userId],
			);
		}

		await client.query('COMMIT');
		return Boolean(deleted);
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
};
