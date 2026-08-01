const PRODUCT_TYPE_ICONS = {
	ring: 'diamond-outline',
	necklace: 'link-outline',
	bracelet: 'ellipse-outline',
	earring: 'star-outline',
	watch: 'watch-outline',
};

export const getProductTypeIcon = slug => PRODUCT_TYPE_ICONS[slug] ?? 'sparkles-outline';
