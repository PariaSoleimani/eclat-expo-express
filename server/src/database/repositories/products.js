import database from '#database/client.js';

const buildProductFilters = ({ audience, productType, category, color, minPrice, maxPrice, search }) => {
	const conditions = ['products.is_active = true'];
	const values = [];

	if (audience?.length) {
		values.push(audience);
		conditions.push(`products.audience = ANY($${values.length})`);
	}

	if (productType?.length) {
		values.push(productType);
		conditions.push(`product_types.slug = ANY($${values.length})`);
	}

	if (category?.length) {
		values.push(category);
		conditions.push(`EXISTS (
			SELECT 1
			FROM product_categories
			JOIN categories ON categories.id = product_categories.category_id
			WHERE product_categories.product_id = products.id AND categories.slug = ANY($${values.length})
		)`);
	}

	if (color?.length) {
		values.push(color);
		conditions.push(`EXISTS (
			SELECT 1
			FROM product_variants
			JOIN colors ON colors.id = product_variants.color_id
			WHERE product_variants.product_id = products.id AND colors.slug = ANY($${values.length})
		)`);
	}

	if (minPrice !== undefined && minPrice !== '') {
		values.push(minPrice);
		conditions.push(`products.base_price >= $${values.length}`);
	}

	if (maxPrice !== undefined && maxPrice !== '') {
		values.push(maxPrice);
		conditions.push(`products.base_price <= $${values.length}`);
	}

	if (search) {
		values.push(`%${search}%`);
		conditions.push(`(products.name ILIKE $${values.length} OR products.description ILIKE $${values.length})`);
	}

	return {
		where: `WHERE ${conditions.join(' AND ')}`,
		values,
	};
};

export const findProducts = async filters => {
	const { where, values } = buildProductFilters(filters);

	const { rows } = await database.query(
		`
			SELECT
				products.id,
				products.sku,
				products.name,
				products.description,
				products.audience,
				products.base_price,
				products.gemstone,
				products.rating,
				products.review_count,
				product_types.name AS product_type_name,
				product_types.slug AS product_type_slug,
				(
					SELECT url
					FROM product_images
					WHERE product_images.product_id = products.id
					ORDER BY product_images.is_primary DESC, product_images.sort_order ASC
					LIMIT 1
				) AS primary_image_url
			FROM products
			JOIN product_types ON product_types.id = products.product_type_id
			${where}
			ORDER BY products.created_at DESC
		`,
		values,
	);

	return rows;
};

export const findProductById = async (id, { activeOnly = true } = {}) => {
	const conditions = ['products.id = $1'];

	if (activeOnly) {
		conditions.push('products.is_active = true');
	}

	const { rows } = await database.query(
		`
			SELECT
				products.id,
				products.sku,
				products.name,
				products.description,
				products.audience,
				products.base_price,
				products.gemstone,
				products.rating,
				products.review_count,
				products.is_active,
				product_types.name AS product_type_name,
				product_types.slug AS product_type_slug
			FROM products
			JOIN product_types ON product_types.id = products.product_type_id
			WHERE ${conditions.join(' AND ')}
		`,
		[id],
	);

	return rows[0] ?? null;
};

export const findProductImages = async productId => {
	const { rows } = await database.query(
		`
			SELECT
				id,
				url,
				is_primary,
				sort_order
			FROM product_images
			WHERE product_id = $1
			ORDER BY is_primary DESC, sort_order ASC
		`,
		[productId],
	);

	return rows;
};

export const findProductMaterials = async productId => {
	const { rows } = await database.query(
		`
			SELECT
				materials.id,
				materials.slug,
				materials.name
			FROM product_materials
			JOIN materials ON materials.id = product_materials.material_id
			WHERE product_materials.product_id = $1
			ORDER BY materials.name ASC
		`,
		[productId],
	);

	return rows;
};

export const findProductCategories = async productId => {
	const { rows } = await database.query(
		`
			SELECT
				categories.id,
				categories.slug,
				categories.name,
				categories.sort_order
			FROM product_categories
			JOIN categories ON categories.id = product_categories.category_id
			WHERE product_categories.product_id = $1
			ORDER BY categories.sort_order ASC
		`,
		[productId],
	);

	return rows;
};

export const findProductVariants = async productId => {
	const { rows } = await database.query(
		`
			SELECT
				product_variants.id,
				product_variants.size_label,
				product_variants.stock,
				product_variants.price_delta,
				json_build_object(
					'id', colors.id,
					'slug', colors.slug,
					'name', colors.name,
					'hex', colors.hex
				) AS color
			FROM product_variants
			JOIN colors ON colors.id = product_variants.color_id
			WHERE product_variants.product_id = $1
			ORDER BY colors.name ASC, product_variants.size_label ASC
		`,
		[productId],
	);

	return rows;
};
