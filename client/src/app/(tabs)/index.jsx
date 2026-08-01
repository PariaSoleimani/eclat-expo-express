import BannerCarousel from '@/components/BannerCarousel';
import CategoryItem from '@/components/CategoryItem';
import ScreenState from '@/components/common/ScreenState';
import Header from '@/components/Header';
import ProductCard from '@/components/products/ProductCard';
import { useCatalog } from '@/context/CatalogContext';
import { COLORS } from '@/lib/colors';
import { getProductTypeIcon } from '@/lib/icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const CategorySection = ({ category, onViewAll, isLoading }) => {
	const preview = category.items.slice(0, 2);

	if (!isLoading && preview.length === 0) {
		return null;
	}

	return (
		<View style={styles.section}>
			<View style={styles.sectionHeading}>
				<Text style={styles.sectionTitle}>{category.name}</Text>
				<Pressable onPress={onViewAll}>
					<Text style={styles.link}>View all</Text>
				</Pressable>
			</View>
			{isLoading ? (
				<Text style={styles.loadingText}>Loading...</Text>
			) : (
				<View style={styles.productGrid}>
					{preview.map((product, index) => (
						<View
							key={product.id}
							style={[styles.productGridItem, index % 2 !== 0 && styles.rightItem]}>
							<ProductCard product={product} />
						</View>
					))}
				</View>
			)}
		</View>
	);
};

const HomeScreen = () => {
	const router = useRouter();
	const { banners, categories, jewelryTypes, isLoading, error, refetch } = useCatalog();

	return (
		<View style={styles.screen}>
			<Header
				showCart
				showLogo
				showSearch
			/>

			{isLoading ? (
				<ScreenState
					mode="loading"
					title="Loading jewelry"
					description="Finding the latest Éclat pieces."
				/>
			) : error ? (
				<ScreenState
					mode="error"
					title="Could not load jewelry"
					description={error}
					actionLabel="Try again"
					onAction={refetch}
				/>
			) : categories.length === 0 ? (
				<ScreenState
					title="No collections yet"
					description="Please check back soon for new pieces."
				/>
			) : (
				<ScrollView
					contentContainerStyle={styles.content}
					showsVerticalScrollIndicator={false}>
					<BannerCarousel
						banners={banners}
						paddingHorizontal={18}
						onExplore={() => router.push('/shop')}
					/>
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
							{jewelryTypes.map(productType => (
								<CategoryItem
									key={productType.id}
									item={{
										...productType,
										icon: getProductTypeIcon(productType.slug),
									}}
									onPress={() =>
										router.push({
											pathname: '/shop',
											params: { productType: productType.slug },
										})
									}
								/>
							))}
						</ScrollView>
					</View>

					{categories.map(category => (
						<CategorySection
							key={category.id}
							category={category}
							isLoading={isLoading}
							onViewAll={() => router.push({ pathname: '/shop', params: { category: category.slug } })}
						/>
					))}
				</ScrollView>
			)}
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
	loadingText: { color: COLORS.secondary.DEFAULT, fontSize: 13 },
	productGrid: { flexDirection: 'row', flexWrap: 'wrap', flex: 1 },
	productGridItem: { flexBasis: '48%', marginBottom: 14 },
	rightItem: { marginLeft: 14 },
});

export default HomeScreen;
