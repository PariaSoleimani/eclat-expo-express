import ScreenState from '@/components/common/ScreenState';
import Header from '@/components/Header';
import { useCart } from '@/context/CartContext';
import { COLORS } from '@/lib/colors';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const Row = ({ label, value }) => (
	<View style={styles.row}>
		<Text style={styles.rowLabel}>{label}</Text>
		<Text style={styles.rowValue}>{value === 0 ? 'Complimentary' : `$${value}`}</Text>
	</View>
);

const CartScreen = () => {
	const router = useRouter();
	const { cart, removeItem, updateItem } = useCart();
	const removeCartItem = removeItem;
	const updateCartItem = (itemId, quantity) => {
		if (quantity < 1) {
			return removeItem(itemId);
		}

		return updateItem(itemId, quantity);
	};

	return (
		<View style={styles.screen}>
			<Header title="My bag" />
			{cart.items.length === 0 ? (
				<ScreenState
					icon="bag"
					title="Your bag is empty"
					description="Find a piece that feels like you."
					actionLabel="Shop jewelry"
					onAction={() => router.push('/shop')}
				/>
			) : (
				<ScrollView contentContainerStyle={styles.content}>
					{cart.items.map(item => (
						<View
							key={item.id}
							style={styles.item}>
							<Image
								source={{ uri: item.product.images[0]?.url }}
								style={styles.image}
							/>
							<View style={styles.itemDetails}>
								<View style={styles.itemTop}>
									<View style={styles.itemCopy}>
										<Text
											numberOfLines={1}
											style={styles.itemName}>
											{item.product.name}
										</Text>
										<Text style={styles.variant}>
											{item.variant.color.name} · {item.variant.sizeLabel}
										</Text>
									</View>
									<Pressable onPress={() => removeCartItem(item.id)}>
										<Text style={styles.remove}>Remove</Text>
									</Pressable>
								</View>
								<View style={styles.itemBottom}>
									<Text style={styles.itemPrice}>${item.unitPrice.toFixed(2)}</Text>
									<View style={styles.stepper}>
										<Pressable onPress={() => updateCartItem(item.id, item.quantity - 1)}>
										<Ionicons
												name="remove"
												size={21}
												color="black"
											/>
										</Pressable>
										<Text style={styles.quantity}>{item.quantity}</Text>
										<Pressable onPress={() => updateCartItem(item.id, item.quantity + 1)}>
											<Ionicons
												name="add"
												size={20}
												color="black"
											/>
										</Pressable>
									</View>
								</View>
							</View>
						</View>
					))}
					<View style={styles.summary}>
						<Row
							label="Subtotal"
							value={cart.subtotal}
						/>
						<Row
							label="Shipping"
							value={cart.shipping}
						/>
						<View style={styles.totalRow}>
							<Text style={styles.totalLabel}>Total</Text>
							<Text style={styles.total}>${Number(cart.total).toFixed(2)}</Text>
						</View>
						<Pressable style={styles.checkout}>
							<Text style={styles.checkoutText}>Checkout</Text>
						</Pressable>
					</View>
				</ScrollView>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	screen: { backgroundColor: COLORS.background.DEFAULT, flex: 1 },
	content: { padding: 18 },
	item: {
		backgroundColor: COLORS.surface.DEFAULT,
		borderRadius: 16,
		flexDirection: 'row',
		marginBottom: 13,
		padding: 10,
	},
	image: { backgroundColor: COLORS.background[200], borderRadius: 12, height: 95, width: 82 },
	itemDetails: { flex: 1, justifyContent: 'space-between', paddingLeft: 12 },
	itemTop: { flexDirection: 'row', justifyContent: 'space-between' },
	itemCopy: { flex: 1, paddingRight: 4 },
	itemName: { color: COLORS.primary.DEFAULT, fontSize: 14, fontWeight: '800' },
	variant: { color: COLORS.secondary.DEFAULT, fontSize: 12, marginTop: 4 },
	remove: { color: COLORS.accent[900], fontSize: 11, fontWeight: '700' },
	itemBottom: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
	itemPrice: { color: COLORS.primary.DEFAULT, fontSize: 16, fontWeight: '800' },
	stepper: {
		alignItems: 'center',
		backgroundColor: COLORS.background[200],
		borderRadius: 18,
		flexDirection: 'row',
		gap: 14,
		paddingHorizontal: 10,
		paddingVertical: 5,
	},
	step: { color: COLORS.primary.DEFAULT, fontSize: 18, fontWeight: '600' },
	quantity: { color: COLORS.primary.DEFAULT, fontSize: 13, fontWeight: '700' },
	summary: {
		backgroundColor: COLORS.surface.DEFAULT,
		borderRadius: 18,
		marginTop: 14,
		padding: 18,
		borderWidth: 1,
		borderColor: COLORS.border.DEFAULT,
	},
	row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
	rowLabel: { color: COLORS.secondary.DEFAULT, fontSize: 14 },
	rowValue: { color: COLORS.primary.DEFAULT, fontSize: 14, fontWeight: '700' },
	totalRow: {
		borderTopColor: COLORS.border.DEFAULT,
		borderTopWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 5,
		paddingTop: 15,
	},
	totalLabel: { color: COLORS.primary.DEFAULT, fontSize: 17, fontWeight: '800' },
	total: { color: COLORS.primary.DEFAULT, fontSize: 18, fontWeight: '800' },
	checkout: {
		alignItems: 'center',
		backgroundColor: COLORS.primary.DEFAULT,
		borderRadius: 28,
		marginTop: 20,
		paddingVertical: 16,
	},
	checkoutText: { color: COLORS.background.DEFAULT, fontSize: 15, fontWeight: '800' },
});

export default CartScreen;
