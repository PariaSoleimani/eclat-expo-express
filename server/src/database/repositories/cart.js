import crypto from 'node:crypto';
import database from '#database/client.js';

export const findCartByUserId = async userId => {
	const { rows } = await database.query(
		`
			SELECT id
			FROM carts
			WHERE user_id = $1
		`,
		[userId],
	);

	return rows[0] ?? null;
};

export const createCart = async userId => {
	const { rows } = await database.query(
		`
			INSERT INTO carts (id, user_id)
			VALUES ($1, $2)
			RETURNING id, user_id, updated_at
		`,
		[crypto.randomUUID(), userId],
	);

	return rows[0];
};

export const findCartItems = async cartId => {
	const { rows } = await database.query(
		`
			SELECT
				id,
				quantity,
				json_build_object(
					'id', product_variants.id,
					'size_label', product_variants.size_label,
					'stock', product_variants.stock,
					'price_delta', product_variants.price_delta,
					'color', json_build_object(
						'id', colors.id,
						'slug', colors.slug,
						'name', colors.name,
						'hex', colors.hex
					),
					'product', json_build_object(
						'id', products.id,
						'name', products.name,
						'base_price', products.base_price,
						'primary_image_url', (
							SELECT product_images.url
							FROM product_images
							WHERE product_images.product_id = products.id
							ORDER BY product_images.is_primary DESC, product_images.sort_order ASC
							LIMIT 1
						)
					)
				) AS variant,
				(p.base_price + pv.price_delta) AS unit_price,
				((p.base_price + pv.price_delta) * ci.quantity) AS line_total
			FROM cart_items
			JOIN product_variants ON product_variants.id = cart_items.variant_id
			JOIN colors ON colors.id = product_variants.color_id
			JOIN products ON products.id = product_variants.product_id
			WHERE cart_items.cart_id = $1
			ORDER BY cart_items.id ASC
		`,
		[cartId],
	);

	return rows;
};

export const findVariantForCart = async variantId => {
	const { rows } = await database.query(
		`
			SELECT
				pv.id,
				pv.stock,
				p.is_active
			FROM product_variants pv
			JOIN products p ON p.id = pv.product_id
			WHERE pv.id = $1
		`,
		[variantId],
	);

	return rows[0] ?? null;
};

export const findCartItemById = async (cartId, itemId) => {
	const { rows } = await database.query(
		`
			SELECT
				ci.id,
				ci.quantity,
				ci.variant_id,
				pv.stock
			FROM cart_items ci
			JOIN product_variants pv ON pv.id = ci.variant_id
			WHERE ci.cart_id = $1 AND ci.id = $2
		`,
		[cartId, itemId],
	);

	return rows[0] ?? null;
};

export const findCartItemByVariantId = async (cartId, variantId) => {
	const { rows } = await database.query(
		`
			SELECT id, quantity, variant_id
			FROM cart_items
			WHERE cart_id = $1 AND variant_id = $2
		`,
		[cartId, variantId],
	);

	return rows[0] ?? null;
};

export const createCartItem = async (cartId, variantId, quantity) => {
	const { rows } = await database.query(
		`
			INSERT INTO cart_items (id, cart_id, variant_id, quantity)
			VALUES ($1, $2, $3, $4)
			RETURNING id, cart_id, variant_id, quantity
		`,
		[crypto.randomUUID(), cartId, variantId, quantity],
	);

	return rows[0];
};

export const updateCartItemQuantity = async (itemId, quantity) => {
	const { rows } = await database.query(
		`
			UPDATE cart_items
			SET quantity = $2
			WHERE id = $1
			RETURNING id, cart_id, variant_id, quantity
		`,
		[itemId, quantity],
	);

	return rows[0] ?? null;
};

export const deleteCartItem = async (cartId, itemId) => {
	const { rowCount } = await database.query(
		`
			DELETE FROM cart_items
			WHERE cart_id = $1 AND id = $2
		`,
		[cartId, itemId],
	);

	return rowCount > 0;
};

export const touchCart = async cartId => {
	await database.query(
		`
			UPDATE carts
			SET updated_at = now()
			WHERE id = $1
		`,
		[cartId],
	);
};

export const clearCartItems = async (cartId, client = database) => {
	await client.query(
		`
			DELETE FROM cart_items
			WHERE cart_id = $1
		`,
		[cartId],
	);
};
