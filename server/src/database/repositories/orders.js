import crypto from 'node:crypto';
import database from '#database/client.js';
import { clearCartItems } from '#repositories/cart.js';
import { HttpError } from '#utils/error.js';

export const findOrdersByUserId = async userId => {
	const { rows } = await database.query(
		`
			SELECT
				orders.id,
				orders.status,
				orders.shipping_address,
				orders.created_at,
				COUNT(order_items.id)::int AS item_count,
				COALESCE(SUM(order_items.unit_price * order_items.quantity), 0) AS total
			FROM orders
			JOIN order_items ON order_items.order_id = orders.id
			WHERE orders.user_id = $1
			GROUP BY orders.id
			ORDER BY orders.created_at DESC
		`,
		[userId],
	);

	return rows;
};

export const findOrderById = async (userId, orderId) => {
	const { rows } = await database.query(
		`
			SELECT
				o.id,
				o.status,
				o.shipping_address,
				o.created_at
			FROM orders o
			WHERE o.user_id = $1 AND o.id = $2
		`,
		[userId, orderId],
	);

	return rows[0] ?? null;
};

export const findOrderItems = async orderId => {
	const { rows } = await database.query(
		`
			SELECT
				oi.id,
				oi.quantity,
				oi.unit_price,
				(oi.unit_price * oi.quantity) AS line_total,
				json_build_object(
					'id', pv.id,
					'size_label', pv.size_label,
					'color', json_build_object(
						'id', col.id,
						'slug', col.slug,
						'name', col.name,
						'hex', col.hex
					),
					'product', json_build_object(
						'id', p.id,
						'name', p.name,
						'primary_image_url', (
							SELECT pi.url
							FROM product_images pi
							WHERE pi.product_id = p.id
							ORDER BY pi.is_primary DESC, pi.sort_order ASC
							LIMIT 1
						)
					)
				) AS variant
			FROM order_items oi
			JOIN product_variants pv ON pv.id = oi.variant_id
			JOIN colors col ON col.id = pv.color_id
			JOIN products p ON p.id = pv.product_id
			WHERE oi.order_id = $1
			ORDER BY oi.id ASC
		`,
		[orderId],
	);

	return rows;
};

export const createOrderFromCart = async (userId, shippingAddress) => {
	const client = await database.connect();

	try {
		await client.query('BEGIN');

		const { rows: cartRows } = await client.query(
			`
				SELECT id
				FROM carts
				WHERE user_id = $1
				FOR UPDATE
			`,
			[userId],
		);

		const cart = cartRows[0];

		if (!cart) {
			throw new HttpError(400, 'Cart is empty.');
		}

		const { rows: cartItems } = await client.query(
			`
				SELECT
					ci.variant_id,
					ci.quantity,
					pv.stock,
					(p.base_price + pv.price_delta) AS unit_price,
					p.name AS product_name,
					p.is_active
				FROM cart_items ci
				JOIN product_variants pv ON pv.id = ci.variant_id
				JOIN products p ON p.id = pv.product_id
				WHERE ci.cart_id = $1
				FOR UPDATE OF ci, pv
			`,
			[cart.id],
		);

		if (cartItems.length === 0) {
			throw new HttpError(400, 'Cart is empty.');
		}

		for (const item of cartItems) {
			if (!item.is_active) {
				throw new HttpError(400, `${item.product_name} is no longer available.`);
			}

			if (item.quantity > item.stock) {
				throw new HttpError(400, `Not enough stock for ${item.product_name}.`);
			}
		}

		const orderId = crypto.randomUUID();

		const { rows: orderRows } = await client.query(
			`
				INSERT INTO orders (id, user_id, status, shipping_address)
				VALUES ($1, $2, 'pending', $3)
				RETURNING id, status, shipping_address, created_at
			`,
			[orderId, userId, shippingAddress],
		);

		for (const item of cartItems) {
			await client.query(
				`
					INSERT INTO order_items (id, order_id, variant_id, quantity, unit_price)
					VALUES ($1, $2, $3, $4, $5)
				`,
				[crypto.randomUUID(), orderId, item.variant_id, item.quantity, item.unit_price],
			);

			await client.query(
				`
					UPDATE product_variants
					SET stock = stock - $2
					WHERE id = $1
				`,
				[item.variant_id, item.quantity],
			);
		}

		await clearCartItems(cart.id, client);
		await client.query(
			`
				UPDATE carts
				SET updated_at = now()
				WHERE id = $1
			`,
			[cart.id],
		);

		await client.query('COMMIT');
		return orderRows[0];
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
};
