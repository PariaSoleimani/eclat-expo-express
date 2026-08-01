import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';
import ScreenState from '@/components/common/ScreenState';
import ProductCard from '@/components/products/ProductCard';
import { useCatalog } from '@/context/CatalogContext';
import useProducts from '@/hooks/useProducts';
import { COLORS } from '@/lib/colors';
import { useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, Pressable, View } from 'react-native';

const PRICE_FILTERS = [
	{ label: 'Any price', value: null },
	{ label: 'Under $125', value: 125 },
	{ label: 'Under $175', value: 175 },
	{ label: 'Under $250', value: 250 },
];

const ShopScreen = () => {
	const params = useLocalSearchParams();
	const { jewelryTypes } = useCatalog();
	const initialType =
		typeof params.productType === 'string'
			? params.productType
			: typeof params.type === 'string'
				? params.type
				: 'all';
	const [query, setQuery] = useState('');
	const [audience, setAudience] = useState(params.audience ?? 'all');
	const [type, setType] = useState(initialType);
	const [category, setCategory] = useState(params.category ?? 'all');
	const [maxPrice, setMaxPrice] = useState(null);
	const [color, setColor] = useState('all');
	const [filterOpen, setFilterOpen] = useState(false);
	const selectedType = jewelryTypes.find(item => item.slug === type || item.id === type);
	const productFilters = useMemo(
		() => ({
			audience: audience === 'all' ? undefined : audience,
			productType: type === 'all' ? undefined : (selectedType?.slug ?? type),
			category: category === 'all' ? undefined : category,
			maxPrice: maxPrice ?? undefined,
			color: color === 'all' ? undefined : color,
			search: query.trim() || undefined,
		}),
		[audience, category, color, maxPrice, query, selectedType?.slug, type],
	);
	const { products } = useProducts(productFilters);
	const activeFilterCount = [
		audience !== 'all',
		type !== 'all',
		category !== 'all',
		maxPrice !== null,
		color !== 'all',
	].filter(Boolean).length;

	const filteredProducts = products;

	return (
		<View style={styles.screen}>
			<Header
				title="Shop"
				showBack
				showCart
			/>
			<View style={styles.search}>
				<Ionicons
					name="search-outline"
					size={21}
					color={COLORS.secondary.DEFAULT}
				/>
				<TextInput
					value={query}
					onChangeText={setQuery}
					placeholder="Search jewelry"
					placeholderTextColor={COLORS.secondary[300]}
					style={styles.searchInput}
				/>
			</View>
			<View style={styles.resultsBar}>
				<Text style={styles.resultsText}>
					{filteredProducts.length} {filteredProducts.length === 1 ? 'piece' : 'pieces'}
				</Text>
				<Pressable
					style={styles.filterButton}
					onPress={() => setFilterOpen(true)}>
					<Ionicons
						name="options-outline"
						size={18}
						color={COLORS.background.DEFAULT}
					/>
					<Text style={styles.filterButtonText}>
						Filter{activeFilterCount ? ` (${activeFilterCount})` : ''}
					</Text>
				</Pressable>
			</View>
			<FlatList
				contentContainerStyle={filteredProducts.length ? styles.list : styles.emptyList}
				data={filteredProducts}
				keyExtractor={item => item.id}
				ListEmptyComponent={
					<ScreenState
						title="No pieces found"
						description="Try removing a filter or searching for something else."
					/>
				}
				numColumns={2}
				renderItem={({ item, index }) => (
					<View style={[styles.item, index % 2 === 0 ? styles.leftItem : styles.rightItem]}>
						<ProductCard product={item} />
					</View>
				)}
			/>
			<Modal
				animationType="slide"
				transparent
				visible={filterOpen}
				onRequestClose={() => setFilterOpen(false)}>
				<View style={styles.modalBackdrop}>
					<View style={styles.sheet}>
						<View style={styles.sheetHeader}>
							<View>
								<Text style={styles.sheetEyebrow}>REFINE YOUR EDIT</Text>
								<Text style={styles.sheetTitle}>Filters</Text>
							</View>
							<Pressable
								style={styles.closeButton}
								onPress={() => setFilterOpen(false)}>
								<Ionicons
									name="close"
									size={22}
									color={COLORS.primary.DEFAULT}
								/>
							</Pressable>
						</View>
						<ScrollView showsVerticalScrollIndicator={false}>
							<FilterSection title="Audience">
								<FilterChip
									label="All"
									active={audience === 'all'}
									onPress={() => setAudience('all')}
								/>
								<FilterChip
									label="Men"
									active={audience === 'men'}
									onPress={() => setAudience('men')}
								/>
								<FilterChip
									label="Women"
									active={audience === 'women'}
									onPress={() => setAudience('women')}
								/>
							</FilterSection>
							<FilterSection title="Jewelry type">
								<FilterChip
									label="All types"
									active={type === 'all'}
									onPress={() => setType('all')}
								/>
								{jewelryTypes.map(item => (
									<FilterChip
										key={item.id}
										label={item.name}
										active={type === item.slug}
										onPress={() => setType(item.slug)}
									/>
								))}
							</FilterSection>
							<FilterSection title="Price">
								{PRICE_FILTERS.map(item => (
									<FilterChip
										key={item.label}
										label={item.label}
										active={maxPrice === item.value}
										onPress={() => setMaxPrice(item.value)}
									/>
								))}
							</FilterSection>
							<FilterSection title="Metal">
								<FilterChip
									label="All finishes"
									active={color === 'all'}
									onPress={() => setColor('all')}
								/>
								<FilterChip
									label="Gold"
									active={color === 'yellow-gold'}
									onPress={() => setColor('yellow-gold')}
								/>
								<FilterChip
									label="Silver"
									active={color === 'silver'}
									onPress={() => setColor('silver')}
								/>
							</FilterSection>
						</ScrollView>
						<View style={styles.sheetFooter}>
							<Pressable
								onPress={() => {
									setAudience('all');
									setType('all');
									setCategory('all');
									setMaxPrice(null);
									setColor('all');
								}}>
								<Text style={styles.clearText}>Clear all</Text>
							</Pressable>
							<Pressable
								style={styles.showButton}
								onPress={() => setFilterOpen(false)}>
								<Text style={styles.showButtonText}>Show {filteredProducts.length} pieces</Text>
							</Pressable>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
};

const FilterSection = ({ title, children }) => (
	<View style={styles.filterSection}>
		<Text style={styles.sectionTitle}>{title}</Text>
		<View style={styles.chipGroup}>{children}</View>
	</View>
);

const FilterChip = ({ label, active, onPress }) => (
	<Pressable
		onPress={onPress}
		style={[styles.chip, active && styles.activeChip]}>
		<Text style={[styles.chipText, active && styles.activeChipText]}>{label}</Text>
	</Pressable>
);

const styles = StyleSheet.create({
	screen: { backgroundColor: COLORS.background.DEFAULT, flex: 1 },
	search: {
		alignItems: 'center',
		backgroundColor: COLORS.primary[100],
		borderRadius: 14,
		flexDirection: 'row',
		gap: 8,
		marginHorizontal: 18,
		marginTop: 15,
		paddingHorizontal: 13,
	},
	searchInput: { color: COLORS.primary.DEFAULT, flex: 1, fontSize: 15, height: 48 },
	resultsBar: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingHorizontal: 18,
		paddingTop: 15,
	},
	resultsText: { color: COLORS.secondary.DEFAULT, fontSize: 13, fontWeight: '600' },
	filterButton: {
		alignItems: 'center',
		backgroundColor: COLORS.primary.DEFAULT,
		borderRadius: 18,
		flexDirection: 'row',
		gap: 6,
		paddingHorizontal: 13,
		paddingVertical: 9,
	},
	filterButtonText: { color: COLORS.background.DEFAULT, fontSize: 12, fontWeight: '800' },
	chip: {
		backgroundColor: COLORS.surface.DEFAULT,
		borderColor: COLORS.border.DEFAULT,
		borderRadius: 18,
		borderWidth: 1,
		paddingHorizontal: 14,
		paddingVertical: 9,
	},
	activeChip: { backgroundColor: COLORS.primary.DEFAULT, borderColor: COLORS.primary.DEFAULT },
	chipText: { color: COLORS.primary.DEFAULT, fontSize: 12, fontWeight: '700' },
	activeChipText: { color: COLORS.background.DEFAULT },
	list: { padding: 16, paddingTop: 18 },
	emptyList: { flexGrow: 1, justifyContent: 'center' },
	item: { flex: 1, marginBottom: 14 },
	leftItem: { marginRight: 7 },
	rightItem: { marginLeft: 7 },
	modalBackdrop: { backgroundColor: 'rgba(31, 26, 22, 0.35)', flex: 1, justifyContent: 'flex-end' },
	sheet: {
		backgroundColor: COLORS.background.DEFAULT,
		borderTopLeftRadius: 28,
		borderTopRightRadius: 28,
		maxHeight: '86%',
		paddingTop: 22,
	},
	sheetHeader: {
		alignItems: 'center',
		flexDirection: 'row',
		justifyContent: 'space-between',
		paddingBottom: 18,
		paddingHorizontal: 22,
	},
	sheetEyebrow: { color: COLORS.accent[900], fontSize: 10, fontWeight: '800', letterSpacing: 1.3 },
	sheetTitle: { color: COLORS.primary.DEFAULT, fontSize: 25, fontWeight: '800', marginTop: 3 },
	closeButton: {
		alignItems: 'center',
		backgroundColor: COLORS.primary[100],
		borderRadius: 20,
		height: 40,
		justifyContent: 'center',
		width: 40,
	},
	filterSection: {
		borderTopColor: COLORS.border.DEFAULT,
		borderTopWidth: 1,
		paddingHorizontal: 22,
		paddingVertical: 17,
	},
	sectionTitle: { color: COLORS.primary.DEFAULT, fontSize: 14, fontWeight: '800', marginBottom: 11 },
	chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
	sheetFooter: {
		alignItems: 'center',
		borderTopColor: COLORS.border.DEFAULT,
		borderTopWidth: 1,
		flexDirection: 'row',
		gap: 14,
		padding: 16,
		paddingHorizontal: 22,
	},
	clearText: { color: COLORS.accent[900], fontSize: 13, fontWeight: '800', paddingHorizontal: 4 },
	showButton: {
		alignItems: 'center',
		backgroundColor: COLORS.primary.DEFAULT,
		borderRadius: 24,
		flex: 1,
		paddingVertical: 14,
	},
	showButtonText: { color: COLORS.background.DEFAULT, fontSize: 14, fontWeight: '800' },
});

export default ShopScreen;
