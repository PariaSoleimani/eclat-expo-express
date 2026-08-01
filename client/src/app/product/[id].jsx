import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';
import ScreenState from '@/components/common/ScreenState';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import useProduct from '@/hooks/useProduct';
import { COLORS } from '@/lib/colors';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, Pressable, View } from 'react-native';

const ProductDetailsScreen = () => {
	const { id } = useLocalSearchParams();
	const router = useRouter();
	const { isAuthenticated } = useAuth();
	const { product, isLoading } = useProduct(id);
	const { addItem: addToCart } = useCart();
	const { isWishlisted, toggleWishlist } = useWishlist();
	const [variantId, setVariantId] = useState(null);

	useEffect(() => {
		setVariantId(product?.variants[0]?.id ?? null);
	}, [product?.id]);

	if (isLoading) {
		return (
			<View style={styles.screen}>
				<Header
					title="Jewelry"
					showBack
				/>
				<ScreenState
					mode="loading"
					title="Loading piece..."
				/>
			</View>
		);
	}

	if (!product) {
		return (
			<View style={styles.screen}>
				<Header
					title="Jewelry"
					showBack
				/>
				<ScreenState
					title="This piece is unavailable"
					actionLabel="Return to shop"
					onAction={() => router.replace('/shop')}
				/>
			</View>
		);
	}

	const selectedVariant = product.variants.find(item => item.id === variantId) ?? product.variants[0];
	const wished = isWishlisted(product.id);

	return (
		<View style={styles.screen}>
			<Header
				title="Jewelry"
				showBack
				showCart
			/>
			<ScrollView contentContainerStyle={styles.content}>
				<Image
					source={{ uri: product.images[0]?.url }}
					style={styles.image}
				/>
				<View style={styles.details}>
					<View style={styles.titleRow}>
						<View style={styles.titleCopy}>
							<Text style={styles.type}>{product.productType}</Text>
							<Text style={styles.title}>{product.name}</Text>
						</View>
						<Pressable
							style={styles.heart}
							onPress={async () => {
								if (!isAuthenticated) {
									router.push('/auth');
									return;
								}

								try {
									await toggleWishlist(product.id);
								} catch {
									// Error is stored on WishlistContext.
								}
							}}>
							<Ionicons
								name={wished ? 'heart' : 'heart-outline'}
								color={wished ? '#9B3636' : COLORS.primary.DEFAULT}
								size={24}
							/>
						</Pressable>
					</View>
					<Text style={styles.price}>
						${(product.basePrice + (selectedVariant?.priceDelta ?? 0)).toFixed(2)}
					</Text>
					<Text style={styles.description}>{product.description}</Text>
					<View style={styles.detailBlock}>
						<Text style={styles.label}>Details</Text>
						<Text style={styles.detailText}>
							{product.material}
							{product.gemstone ? ` · ${product.gemstone}` : ''}
						</Text>
					</View>
					<Text style={styles.label}>Choose a variation</Text>
					<View style={styles.variants}>
						{product.variants.map(variant => (
							<Pressable
								key={variant.id}
								style={[styles.variant, variant.id === selectedVariant?.id && styles.selectedVariant]}
								onPress={() => setVariantId(variant.id)}>
								<View style={[styles.colorDot, { backgroundColor: variant.color.hex }]} />
								<Text
									style={[
										styles.variantText,
										variant.id === selectedVariant?.id && styles.selectedVariantText,
									]}>
									{variant.sizeLabel}
								</Text>
							</Pressable>
						))}
					</View>
				</View>
			</ScrollView>
			<View style={styles.footer}>
				<Pressable
					style={styles.addButton}
					onPress={async () => {
						if (!isAuthenticated) {
							router.push('/auth');
							return;
						}

						if (!selectedVariant?.id) {
							return;
						}

						try {
							await addToCart({ variantId: selectedVariant.id, quantity: 1 });
							router.push('/(tabs)/cart');
						} catch {
							// Error is stored on CartContext.
						}
					}}>
					<Text style={styles.addButtonText}>
						Add to bag · ${(product.basePrice + (selectedVariant?.priceDelta ?? 0)).toFixed(2)}
					</Text>
				</Pressable>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: { backgroundColor: COLORS.background.DEFAULT, flex: 1 },
	content: { paddingBottom: 105 },
	image: { backgroundColor: COLORS.background[200], height: 360, width: '100%' },
	details: { padding: 20 },
	titleRow: { flexDirection: 'row', justifyContent: 'space-between' },
	titleCopy: { flex: 1, paddingRight: 12 },
	type: { color: COLORS.secondary.DEFAULT, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
	title: { color: COLORS.primary.DEFAULT, fontSize: 25, fontWeight: '800', marginTop: 4 },
	heart: {
		alignItems: 'center',
		backgroundColor: COLORS.primary[100],
		borderRadius: 22,
		height: 44,
		justifyContent: 'center',
		width: 44,
	},
	price: { color: COLORS.accent[900], fontSize: 19, fontWeight: '800', marginTop: 12 },
	description: {
		color: COLORS.secondary.DEFAULT,
		fontSize: 15,
		lineHeight: 22,
		marginTop: 17,
	},
	detailBlock: {
		borderBottomColor: COLORS.border.DEFAULT,
		borderBottomWidth: 1,
		borderTopColor: COLORS.border.DEFAULT,
		borderTopWidth: 1,
		marginVertical: 22,
		paddingVertical: 16,
	},
	label: { color: COLORS.primary.DEFAULT, fontSize: 14, fontWeight: '800' },
	detailText: { color: COLORS.secondary.DEFAULT, fontSize: 13, marginTop: 6 },
	variants: { flexDirection: 'row', flexWrap: 'wrap', gap: 9, marginTop: 12 },
	variant: {
		alignItems: 'center',
		borderColor: COLORS.border.DEFAULT,
		borderRadius: 20,
		borderWidth: 1,
		flexDirection: 'row',
		gap: 6,
		paddingHorizontal: 12,
		paddingVertical: 9,
	},
	selectedVariant: { backgroundColor: COLORS.primary.DEFAULT, borderColor: COLORS.primary.DEFAULT },
	colorDot: { borderColor: COLORS.border.DEFAULT, borderRadius: 7, borderWidth: 1, height: 14, width: 14 },
	variantText: { color: COLORS.primary.DEFAULT, fontSize: 12, fontWeight: '700' },
	selectedVariantText: { color: COLORS.background.DEFAULT },
	footer: {
		backgroundColor: COLORS.surface.DEFAULT,
		borderTopColor: COLORS.border.DEFAULT,
		borderTopWidth: 1,
		bottom: 0,
		left: 0,
		padding: 16,
		position: 'absolute',
		right: 0,
	},
	addButton: { alignItems: 'center', backgroundColor: COLORS.primary.DEFAULT, borderRadius: 26, paddingVertical: 16 },
	addButtonText: { color: COLORS.background.DEFAULT, fontSize: 15, fontWeight: '800' },
});

export default ProductDetailsScreen;
