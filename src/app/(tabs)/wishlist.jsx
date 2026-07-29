import Header from '@/components/Header';
import ScreenState from '@/components/common/ScreenState';
import ProductCard from '@/components/products/ProductCard';
import useFetch from '@/hooks/useFetch';
import { COLORS } from '@/lib/colors';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, View } from 'react-native';

const WishlistScreen = () => {
	const router = useRouter();
	const { wishlist } = useFetch();

	return (
		<View style={styles.screen}>
			<Header
				title="Wishlist"
				showCart
			/>
			<FlatList
				contentContainerStyle={wishlist.length ? styles.list : styles.emptyList}
				data={wishlist}
				keyExtractor={item => item.id}
				ListEmptyComponent={
					<ScreenState
						icon="heart-outline"
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
