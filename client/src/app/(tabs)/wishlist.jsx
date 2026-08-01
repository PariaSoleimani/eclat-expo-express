import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';
import ScreenState from '@/components/common/ScreenState';
import Header from '@/components/Header';
import ProductCard from '@/components/products/ProductCard';
import { useWishlist } from '@/context/WishlistContext';
import { COLORS } from '@/lib/colors';

const WishlistScreen = () => {
	const router = useRouter();
	const { products: wishlist, isLoading, error, refetch } = useWishlist();

	return (
		<View style={styles.screen}>
			<Header
				title="Wishlist"
				showCart
			/>
			{isLoading ? (
				<ScreenState
					mode="loading"
					title="Loading wishlist"
				/>
			) : error ? (
				<ScreenState
					mode="error"
					title="Could not load wishlist"
					description={error}
					actionLabel="Try again"
					onAction={refetch}
				/>
			) : (
				<FlatList
					contentContainerStyle={wishlist.length ? styles.list : styles.emptyList}
					data={wishlist}
					keyExtractor={item => item.id}
					ListEmptyComponent={
						<ScreenState
							icon="heart"
							title="Your wishlist is waiting"
							description="Save pieces you love to find them here."
							actionLabel="Explore jewelry"
							onAction={() => router.push('/shop')}
						/>
					}
					numColumns={2}
					renderItem={({ item, index }) => (
						<View style={[styles.item, index % 2 !== 0 && styles.rightItem]}>
							<ProductCard product={item} />
						</View>
					)}
				/>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	screen: { backgroundColor: COLORS.background.DEFAULT, flex: 1 },
	list: { padding: 18 },
	emptyList: { flexGrow: 1, justifyContent: 'center' },
	item: { flex: 1 , marginBottom: 14},
	rightItem: { marginLeft: 14 },
});

export default WishlistScreen;
