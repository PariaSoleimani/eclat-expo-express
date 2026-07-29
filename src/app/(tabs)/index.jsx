import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
// import BannerCarousel from '@/components/BannerCarousel';
import CategoryItem from '@/components/CategoryItem';
import Header from '@/components/Header';
import ProductCard from '@/components/products/ProductCard';
import useFetch from '@/hooks/useFetch';
import { COLORS } from '@/lib/colors';

const HomeScreen = () => {
	const router = useRouter();
	const { jewelryTypes, products } = useFetch();
	const featuredProducts = products.filter(product => product.isFeatured).slice(0, 4);

	return (
		<View style={styles.screen}>
			<Header
				showCart
				showLogo
				showSearch
			/>

			<ScrollView
				contentContainerStyle={styles.content}
				showsVerticalScrollIndicator={false}>
				<View style={styles.section}>
					<View style={styles.sectionHeading}>
						<Text style={styles.sectionTitle}>Explore by collection</Text>
						<Pressable onPress={() => router.push('/shop')}>
							<Text style={styles.link}>View all</Text>
						</Pressable>
					</View>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						style={{ marginHorizontal: -18 }}>
						{jewelryTypes.map(category => (
							<CategoryItem
								key={category.id}
								item={category}
								onPress={() => router.push({ pathname: '/shop', params: { type: category.id } })}
							/>
						))}
					</ScrollView>
				</View>

				<View style={styles.section}>
					<View style={styles.sectionHeading}>
						<Text style={styles.sectionTitle}>Pieces to treasure</Text>
						<Pressable onPress={() => router.push('/shop')}>
							<Text style={styles.link}>View all</Text>
						</Pressable>
					</View>
					<ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}>
						{featuredProducts.map(product => (
							<ProductCard
								key={product.id}
								product={product}
								compact
							/>
						))}
					</ScrollView>
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: { backgroundColor: COLORS.background.DEFAULT, flex: 1 },
	content: { paddingBottom: 30, paddingHorizontal: 18, paddingTop: 16, flexDirection: 'column', gap: 28 },
	section: {},
	sectionHeading: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
	sectionTitle: { color: COLORS.primary.DEFAULT, fontSize: 20, fontWeight: '800' },
	link: { color: COLORS.accent[900], fontSize: 13, fontWeight: '700' },
});

export default HomeScreen;
