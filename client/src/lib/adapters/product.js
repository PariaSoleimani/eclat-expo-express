export const normalizeProductListItem = product => ({
	id: product.id,
	sku: product.sku,
	name: product.name,
	description: product.description ?? '',
	audience: product.audience,
	basePrice: Number(product.base_price),
	gemstone: product.gemstone,
	rating: Number(product.rating),
	reviewCount: product.review_count,
	productType: product.product_type_name,
	productTypeSlug: product.product_type_slug,
	primaryImageUrl: product.primary_image_url ?? null,
	images: product.primary_image_url ? [{ url: product.primary_image_url }] : [],
});

export const normalizeProductDetail = product => ({
	...normalizeProductListItem(product),
	isActive: product.is_active,
	materials: product.materials ?? [],
	categories: product.categories ?? [],
	material: (product.materials ?? []).map(entry => entry.name).join(', '),
	variants: (product.variants ?? []).map(variant => ({
		id: variant.id,
		sizeLabel: variant.size_label,
		stock: variant.stock,
		priceDelta: Number(variant.price_delta),
		color: variant.color,
	})),
	images: (product.images ?? []).map(image => ({
		id: image.id,
		url: image.url,
		isPrimary: image.is_primary,
		sortOrder: image.sort_order,
	})),
});

export const normalizeWishlistProducts = items =>
	items.map(item => normalizeProductListItem(item.product));
