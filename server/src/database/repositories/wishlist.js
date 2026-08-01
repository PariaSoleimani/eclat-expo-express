import crypto from 'node:crypto';
import database from '#database/client.js';

export const findWishlistByUserId = async userId => {
	const { rows } = await database.query(
		`
			SELECT id, user_id
			FROM wishlists
			WHERE user_id = $1
		`,
		[userId],
	);

	return rows[0] ?? null;
};

export const createWishlist = async userId => {
	const { rows } = await database.query(
		`
			INSERT INTO wishlists (id, user_id)
			VALUES ($1, $2)
			ON CONFLICT (user_id) DO NOTHING
			RETURNING id, user_id
		`,
		[crypto.randomUUID(), userId],
	);

	return rows[0] ?? findWishlistByUserId(userId);
};

export const findWishlistItemIds = async wishlistId => {
	const { rows } = await database.query(
		`
			SELECT product_id
			FROM wishlist_items
			WHERE wishlist_id = $1
			ORDER BY added_at DESC
		`,
		[wishlistId],
	);
	return rows;
};

export const findWishlistItemByProductId = async (wishlistId, productId) => {
	const { rows } = await database.query(
		`
			SELECT id, wishlist_id, product_id, added_at
			FROM wishlist_items
			WHERE wishlist_id = $1 AND product_id = $2
		`,
		[wishlistId, productId],
	);

	return rows[0] ?? null;
};

export const createWishlistItem = async (wishlistId, productId) => {
	const { rows } = await database.query(
		`
			INSERT INTO wishlist_items (id, wishlist_id, product_id)
			VALUES ($1, $2, $3)
			ON CONFLICT (wishlist_id, product_id) DO NOTHING
			RETURNING id, wishlist_id, product_id, added_at
		`,
		[crypto.randomUUID(), wishlistId, productId],
	);

	return rows[0] ?? null;
};

export const deleteWishlistItemByProductId = async (wishlistId, productId) => {
	const { rowCount } = await database.query(
		`
			DELETE FROM wishlist_items
			WHERE wishlist_id = $1 AND product_id = $2
		`,
		[wishlistId, productId],
	);

	return rowCount > 0;
};
