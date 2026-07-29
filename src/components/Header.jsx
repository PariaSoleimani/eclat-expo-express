import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import useFetch from '@/hooks/useFetch';
import { COLORS } from '@/lib/colors';

const Header = ({ title, showBack, showSearch, showCart, showLogo }) => {
	const router = useRouter();
	const { cartItemCount } = useFetch();

	return (
		<View style={styles.header}>
			<View style={styles.actions}>
				{showBack && (
					<Pressable
						android_ripple={{ color: COLORS.primary[300], borderless: false }}
						hitSlop={8}
						onPress={() => router.back()}>
						<Feather
							name="arrow-left"
							size={24}
							color={COLORS.primary.DEFAULT}
						/>
					</Pressable>
				)}

				{showSearch && (
					<Pressable
						android_ripple={{ color: COLORS.primary[300], borderless: false }}
						hitSlop={8}
						onPress={() => router.push('/shop')}>
						<Ionicons
							name="search-outline"
							size={24}
							color={COLORS.primary.DEFAULT}
						/>
					</Pressable>
				)}
			</View>

			<Text style={styles.title}>{showLogo ? 'ATELIER SOL' : title}</Text>

			<View style={styles.actions}>
				{showCart && (
					<Pressable
						android_ripple={{ color: COLORS.primary[300], borderless: false }}
						hitSlop={8}
						onPress={() => router.push('/cart')}>
						<View>
							<Ionicons
								name="bag-outline"
								size={24}
								color={COLORS.primary.DEFAULT}
							/>
							{cartItemCount > 0 && (
								<View style={styles.badge}>
									<Text style={styles.badgeText}>{cartItemCount}</Text>
								</View>
							)}
						</View>
					</Pressable>
				)}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		alignItems: 'center',
		backgroundColor: COLORS.background.DEFAULT,
		borderBottomColor: COLORS.border.DEFAULT,
		borderBottomWidth: 1,
		flexDirection: 'row',
		justifyContent: 'space-between',
		height: 60,
		paddingHorizontal: 18,
	},
	title: {
		color: COLORS.primary.DEFAULT,
		flex: 1,
		fontSize: 17,
		fontWeight: '800',
		letterSpacing: 3,
		textAlign: 'center',
		paddingLeft: 15,
		textTransform: 'uppercase'
	},
	actions: { alignItems: 'center', flexDirection: 'row', gap: 16 },
	badge: {
		alignItems: 'center',
		backgroundColor: COLORS.accent[600],
		borderRadius: 100,
		height: 18,
		minWidth: 18,
		paddingHorizontal: 5,
		justifyContent: 'center',
		position: 'absolute',
		right: -8,
		bottom: -7,
	},
	badgeText: { color: COLORS.background.DEFAULT, fontSize: 10, fontWeight: '800' },
});

export default Header;
