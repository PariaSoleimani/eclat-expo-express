CREATE TYPE audience AS ENUM ('men', 'women');
CREATE TYPE order_status AS ENUM ('pending', 'shipped', 'completed');

CREATE TABLE users (
	id UUID PRIMARY KEY,
	name TEXT NOT NULL,
	phone TEXT NOT NULL UNIQUE,
	is_admin BOOLEAN NOT NULL DEFAULT false,
	url TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE addresses (
	id UUID PRIMARY KEY,
	user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
	label TEXT NOT NULL,
	recipient TEXT NOT NULL,
	country TEXT NOT NULL,
	city TEXT NOT NULL,
	details TEXT NOT NULL,
	postal_code TEXT NOT NULL,
	is_default BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE categories (
	id UUID PRIMARY KEY,
	slug TEXT NOT NULL UNIQUE,
	name TEXT NOT NULL,
	sort_order SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE colors (
	id UUID PRIMARY KEY,
	slug TEXT NOT NULL UNIQUE,
	name TEXT NOT NULL,
	hex CHAR(7) NOT NULL
);

CREATE TABLE product_types (
	id UUID PRIMARY KEY,
	slug TEXT NOT NULL UNIQUE,
	name TEXT NOT NULL
);

CREATE TABLE materials (
	id UUID PRIMARY KEY,
	slug TEXT NOT NULL UNIQUE,
	name TEXT NOT NULL
);

CREATE TABLE banners (
	id UUID PRIMARY KEY,
	title TEXT NOT NULL,
	subtitle TEXT NOT NULL,
	url TEXT NOT NULL,
	sort_order SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE blog_posts (
	id UUID PRIMARY KEY,
	slug TEXT NOT NULL UNIQUE,
	title TEXT NOT NULL,
	excerpt TEXT NOT NULL,
	url TEXT NOT NULL,
	category TEXT NOT NULL,
	content JSONB NOT NULL,
	read_time TEXT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE products (
	id UUID PRIMARY KEY,
	sku TEXT NOT NULL UNIQUE,
	name TEXT NOT NULL,
	description TEXT NOT NULL DEFAULT '',
	audience audience NOT NULL,
	product_type_id UUID NOT NULL REFERENCES product_types(id),
	base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
	gemstone TEXT,
	rating NUMERIC(3, 2) NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
	review_count INTEGER NOT NULL DEFAULT 0 CHECK (review_count >= 0),
	is_active BOOLEAN NOT NULL DEFAULT true,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE product_materials (
	product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
	material_id UUID NOT NULL REFERENCES materials(id),
	PRIMARY KEY (product_id, material_id)
);

CREATE TABLE product_categories (
	product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
	category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
	PRIMARY KEY (product_id, category_id)
);

CREATE TABLE product_images (
	id UUID PRIMARY KEY,
	product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
	url TEXT NOT NULL,
	is_primary BOOLEAN NOT NULL DEFAULT false,
	sort_order SMALLINT NOT NULL DEFAULT 0
);

CREATE TABLE product_variants (
	id UUID PRIMARY KEY,
	product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
	color_id UUID NOT NULL REFERENCES colors(id),
	size_label TEXT NOT NULL,
	stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
	price_delta NUMERIC(10, 2) NOT NULL DEFAULT 0,
	UNIQUE (product_id, color_id, size_label)
);

CREATE TABLE wishlists (
	id UUID PRIMARY KEY,
	user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE wishlist_items (
	id UUID PRIMARY KEY,
	wishlist_id UUID NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
	product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
	added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	UNIQUE (wishlist_id, product_id)
);

CREATE TABLE carts (
	id UUID PRIMARY KEY,
	user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE cart_items (
	id UUID PRIMARY KEY,
	cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
	variant_id UUID NOT NULL REFERENCES product_variants(id),
	quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
	UNIQUE (cart_id, variant_id)
);

CREATE TABLE orders (
	id UUID PRIMARY KEY,
	user_id UUID NOT NULL REFERENCES users(id),
	status order_status NOT NULL DEFAULT 'pending',
	shipping_address TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE order_items (
	id UUID PRIMARY KEY,
	order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
	variant_id UUID NOT NULL REFERENCES product_variants(id),
	quantity INTEGER NOT NULL CHECK (quantity > 0),
	unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0)
);

-- CREATE INDEX products_browse_index ON products (audience, product_type_id, base_price);
-- CREATE INDEX product_categories_category_index ON product_categories (category_id);
-- CREATE INDEX product_materials_material_index ON product_materials (material_id);
-- CREATE INDEX product_images_product_index ON product_images (product_id);
-- CREATE INDEX variants_product_index ON product_variants (product_id);
-- CREATE INDEX orders_status_index ON orders (status, created_at DESC);
