import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import useFetch from '@/hooks/useFetch';
import { COLORS } from '@/lib/colors';

const ProductCard = ({ product }) => {
	const router = useRouter();
	const { isWishlisted, toggleWishlist } = useFetch();
	const imageUrl = product.images?.[0]?.url;
	const wished = isWishlisted(product.id);

	return (
		<Pressable
			style={styles.card}
			onPress={() => router.push(`/product/${product.id}`)}>
			<View style={styles.imageWrap}>
				{imageUrl ? (
					<Image
						source={{ uri: imageUrl }}
						style={styles.image}
					/>
				) : (
					<View style={styles.image} />
				)}
				<Pressable
					style={styles.wishlistButton}
					onPress={() => toggleWishlist(product.id)}>
					<Ionicons
						style={{ transform: [{ translateY: 1 }] }}
						name={wished ? 'heart' : 'heart-outline'}
						size={19}
						color={wished ? '#9B3636' : COLORS.primary[100]}
					/>
				</Pressable>
			</View>
			<View style={styles.details}>
				<Text style={styles.type}>{product.productType}</Text>
				<Text
					numberOfLines={2}
					style={styles.name}>
					{product.name}
				</Text>
				<View style={styles.priceRow}>
					<Text style={styles.price}>${product.basePrice}</Text>
					<View style={styles.ratingWrap}>
						<Ionicons
							name="star"
							size={10}
							color={COLORS.accent[900]}
						/>
						<Text style={styles.ratingLabel}>{product.rating}</Text>
					</View>
				</View>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	card: {
		backgroundColor: COLORS.surface.DEFAULT,
		borderRadius: 16,
		flex: 0,
		overflow: 'hidden',
		elevation: 0.7,
		width: '100%',
	},
	imageWrap: { backgroundColor: COLORS.background[200], height: 190, position: 'relative', width: '100%' },
	image: { height: '100%', width: '100%', backgroundColor: COLORS.primary[100] },
	imageFallback: { backgroundColor: COLORS.primary[100], height: '100%', width: '100%' },
	wishlistButton: {
		alignItems: 'center',
		backgroundColor: 'rgba(1,4,9,0.2)',
		borderRadius: 20,
		height: 30,
		justifyContent: 'center',
		position: 'absolute',
		right: 10,
		top: 10,
		width: 30,
	},
	details: { gap: 5, padding: 12 },
	type: { color: COLORS.secondary.DEFAULT, fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
	name: { color: COLORS.primary.DEFAULT, fontSize: 14, fontWeight: '700' },
	priceRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
	price: { color: COLORS.primary.DEFAULT, fontSize: 16, fontWeight: '800' },
	ratingWrap: { alignItems: 'center', flexDirection: 'row', gap: 2 },
	ratingLabel: { color: COLORS.accent[900], fontSize: 12, fontWeight: '600' },
});

export default ProductCard;
