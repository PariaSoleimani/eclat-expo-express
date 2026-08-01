const normalizeCartItem = item => ({
	id: item.id,
	quantity: item.quantity,
	unitPrice: Number(item.unit_price),
	lineTotal: Number(item.line_total),
	variant: {
		id: item.variant.id,
		sizeLabel: item.variant.size_label,
		stock: item.variant.stock,
		priceDelta: Number(item.variant.price_delta),
		color: item.variant.color,
		product: {
			id: item.variant.product.id,
			name: item.variant.product.name,
			basePrice: Number(item.variant.product.base_price),
			images: item.variant.product.primary_image_url
				? [{ url: item.variant.product.primary_image_url }]
				: [],
		},
	},
	product: {
		id: item.variant.product.id,
		name: item.variant.product.name,
		images: item.variant.product.primary_image_url
			? [{ url: item.variant.product.primary_image_url }]
			: [],
	},
});

export const normalizeCart = cart => {
	const subtotal = Number(cart.subtotal);

	return {
		id: cart.id,
		updatedAt: cart.updated_at,
		itemCount: cart.item_count,
		subtotal,
		shipping: 0,
		total: subtotal,
		items: (cart.items ?? []).map(normalizeCartItem),
	};
};

export const emptyCart = () => ({
	id: null,
	updatedAt: null,
	itemCount: 0,
	subtotal: 0,
	shipping: 0,
	total: 0,
	items: [],
});
