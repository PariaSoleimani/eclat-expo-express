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

export const insertWishlist = async userId => {
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

export const findWishlistItems = async wishlistId => {
	const { rows } = await database.query(
		`
			SELECT
				wishlist_items.id,
				wishlist_items.added_at,
				json_build_object(
					'id', products.id,
					'sku', products.sku,
					'name', products.name,
					'description', products.description,
					'audience', products.audience,
					'base_price', products.base_price,
					'gemstone', products.gemstone,
					'rating', products.rating,
					'review_count', products.review_count,
					'product_type_name', product_types.name,
					'product_type_slug', product_types.slug,
					'primary_image_url', (
						SELECT product_images.url
						FROM product_images
						WHERE product_images.product_id = products.id
						ORDER BY product_images.is_primary DESC, product_images.sort_order ASC
						LIMIT 1
					)
				) AS product
			FROM wishlist_items
			JOIN products ON products.id = wishlist_items.product_id
			JOIN product_types ON product_types.id = products.product_type_id
			WHERE wishlist_items.wishlist_id = $1
				AND products.is_active = true
			ORDER BY wishlist_items.added_at DESC
		`,
		[wishlistId],
	);

	return rows;
};

export const findActiveProductId = async productId => {
	const { rows } = await database.query(
		`
			SELECT id
			FROM products
			WHERE id = $1 AND is_active = true
		`,
		[productId],
	);

	return rows[0]?.id ?? null;
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

export const insertWishlistItem = async (wishlistId, productId) => {
	const { rows } = await database.query(
		`
			INSERT INTO wishlist_items (id, wishlist_id, product_id)
			VALUES ($1, $2, $3)
			RETURNING id, wishlist_id, product_id, added_at
		`,
		[crypto.randomUUID(), wishlistId, productId],
	);

	return rows[0];
};

export const deleteWishlistItemByProduct = async (wishlistId, productId) => {
	const { rowCount } = await database.query(
		`
			DELETE FROM wishlist_items
			WHERE wishlist_id = $1 AND product_id = $2
		`,
		[wishlistId, productId],
	);

	return rowCount > 0;
};
