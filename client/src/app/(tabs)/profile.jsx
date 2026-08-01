import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import Header from '@/components/Header';
import { useAuth } from '@/context/AuthContext';
import { COLORS } from '@/lib/colors';
import { PROFILE_MENU_ITEMS } from '@/lib/constants';

const ProfileScreen = () => {
	const { signOut, user } = useAuth();
	const router = useRouter();

	return (
		<View style={styles.screen}>
			<Header
				title="Profile"
				showCart
			/>
			<View style={styles.profile}>
				{user?.url ? (
					<Image
						source={{ uri: user.url }}
						style={styles.avatar}
					/>
				) : (
					<View style={[styles.avatar, { alignItems: 'center', justifyContent: 'center' }]}>
						<Ionicons
							name="person-circle-outline"
							size={130}
							color={COLORS.primary[300]}
						/>
					</View>
				)}
				<Text style={styles.name}>{user?.name ?? 'Guest'}</Text>
				<Text style={styles.email}>{user?.phone}</Text>
				<View style={styles.memberBadge}>
					<Text style={styles.memberText}>ÉCLAT MEMBER</Text>
				</View>
			</View>
			<View style={styles.menu}>
				{PROFILE_MENU_ITEMS.map((item, index) => (
					<Pressable
						key={item.label}
						style={[styles.menuItem, index < PROFILE_MENU_ITEMS.length - 1 && styles.divider]}
						disabled={!item.route}
						onPress={() => item.route && router.push(item.route)}>
						<Ionicons
							name={item.icon}
							size={21}
							color={COLORS.primary.DEFAULT}
						/>
						<Text style={styles.menuLabel}>{item.label}</Text>
						<Ionicons
							name="chevron-forward"
							size={19}
							color={COLORS.secondary[300]}
						/>
					</Pressable>
				))}
			</View>
			{user?.isAdmin ? (
				<Pressable
					style={styles.adminPanel}
					onPress={() => router.push('/panel')}>
					<Ionicons
						name="analytics-outline"
						size={20}
						color={COLORS.background.DEFAULT}
					/>
					<Text style={styles.adminPanelText}>Open admin panel</Text>
				</Pressable>
			) : null}
			<Pressable
				style={styles.signOut}
				onPress={signOut}>
				<Text style={styles.signOutText}>Sign out</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: { backgroundColor: COLORS.background.DEFAULT, flex: 1 },
	profile: { alignItems: 'center', paddingBottom: 26, paddingTop: 28 },
	avatar: { backgroundColor: COLORS.primary[100], borderRadius: 44, height: 88, width: 88, overflow: 'hidden' },
	name: { color: COLORS.primary.DEFAULT, fontSize: 21, fontWeight: '800', marginTop: 13 },
	email: { color: COLORS.secondary.DEFAULT, fontSize: 13, marginTop: 4 },
	memberBadge: {
		backgroundColor: COLORS.primary.DEFAULT,
		borderRadius: 14,
		marginTop: 15,
		paddingHorizontal: 12,
		paddingVertical: 6,
	},
	memberText: { color: COLORS.background.DEFAULT, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
	menu: { backgroundColor: COLORS.surface.DEFAULT, borderRadius: 17, marginHorizontal: 18, overflow: 'hidden' },
	menuItem: { alignItems: 'center', flexDirection: 'row', gap: 14, paddingHorizontal: 17, paddingVertical: 20 },
	divider: { borderBottomColor: COLORS.border.DEFAULT, borderBottomWidth: 1 },
	menuLabel: { color: COLORS.primary.DEFAULT, flex: 1, fontSize: 15, fontWeight: '700' },
	adminPanel: {
		alignItems: 'center',
		alignSelf: 'center',
		backgroundColor: COLORS.primary.DEFAULT,
		borderRadius: 22,
		flexDirection: 'row',
		gap: 8,
		marginTop: 22,
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	adminPanelText: { color: COLORS.background.DEFAULT, fontSize: 13, fontWeight: '800' },
	signOut: { alignItems: 'center', marginTop: 28 },
	signOutText: { color: COLORS.accent[900], fontSize: 14, fontWeight: '800' },
});

export default ProfileScreen;
