import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenState from '@/components/common/ScreenState';
import Header from '@/components/Header';
import useOrders from '@/hooks/useOrders';
import { COLORS } from '@/lib/colors';

const OrdersScreen = () => {
	const router = useRouter();
	const { orders: customerOrders } = useOrders();

	return (
		<View style={styles.screen}>
			<Header
				title="My orders"
				showBack
				showCart
			/>
			{customerOrders.length === 0 ? (
				<ScreenState
					icon="receipt-outline"
					title="No orders yet"
					description="When you place an order, its progress will appear here."
					actionLabel="Explore jewelry"
					onAction={() => router.push('/shop')}
				/>
			) : (
				<ScrollView contentContainerStyle={styles.content}>
					{customerOrders.map(order => (
						<View
							key={order.id}
							style={styles.order}>
							<View style={styles.orderTop}>
								<View>
									<Text style={styles.orderId}>#{order.id.slice(0, 8).toUpperCase()}</Text>
									<Text style={styles.date}>
										{new Date(order.created_at).toLocaleDateString(undefined, {
											day: 'numeric',
											month: 'short',
											year: 'numeric',
										})}
									</Text>
								</View>
								<Text style={[styles.status, styles[`status${order.status}`]]}>{order.status}</Text>
							</View>
							<Text style={styles.itemCount}>
								{order.item_count} {order.item_count === 1 ? 'piece' : 'pieces'}
							</Text>
							<View style={styles.totalRow}>
								<Text style={styles.totalLabel}>Total</Text>
								<Text style={styles.total}>${Number(order.total).toFixed(2)}</Text>
							</View>
						</View>
					))}
				</ScrollView>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	screen: { backgroundColor: COLORS.background.DEFAULT, flex: 1 },
	content: { padding: 18 },
	order: { backgroundColor: COLORS.surface.DEFAULT, borderRadius: 16, marginBottom: 12, padding: 16 },
	orderTop: { flexDirection: 'row', justifyContent: 'space-between' },
	orderId: { color: COLORS.primary.DEFAULT, fontSize: 14, fontWeight: '800' },
	date: { color: COLORS.secondary.DEFAULT, fontSize: 12, marginTop: 4 },
	status: {
		borderRadius: 14,
		fontSize: 11,
		fontWeight: '800',
		overflow: 'hidden',
		paddingHorizontal: 10,
		paddingVertical: 6,
		textTransform: 'capitalize',
	},
	statuspending: { backgroundColor: COLORS.accent[100], color: COLORS.accent[900] },
	statusshipped: { backgroundColor: '#E7EEF4', color: '#3F5E78' },
	statuscompleted: { backgroundColor: '#E5F1E8', color: '#346641' },
	itemCount: { color: COLORS.secondary.DEFAULT, fontSize: 13, marginTop: 18 },
	totalRow: {
		borderTopColor: COLORS.border.DEFAULT,
		borderTopWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 12,
		paddingTop: 12,
	},
	totalLabel: { color: COLORS.primary.DEFAULT, fontSize: 14, fontWeight: '700' },
	total: { color: COLORS.primary.DEFAULT, fontSize: 15, fontWeight: '800' },
});

export default OrdersScreen;
