// import { useAuth } from '@/context/AuthContext';
import { COLORS } from '@/lib/colors';
import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs, useSegments } from 'expo-router';

const TABBAR_ICONS = {
	index: ['home-outline', 'home'],
	cart: ['cart-outline', 'cart'],
	wishlist: ['heart-outline', 'heart'],
	profile: ['person-outline', 'person'],
};

const TabLayout = () => {
	// const { isAuthenticated } = useAuth();
	// const route = useSegments()[0];

	// if (!isAuthenticated && route !== 'auth') {
	// 	return <Redirect href="/auth" />;
	// }

	return (
		<Tabs
			screenOptions={({ route }) => ({
				headerShown: false,
				tabBarActiveTintColor: COLORS.primary[600],
				tabBarInactiveTintColor: COLORS.primary[300],
				tabBarShowLabel: false,
				tabBarStyle: {
					backgroundColor: COLORS.background.DEFAULT,
					borderTopWidth: 1,
					borderTopColor: COLORS.border.DEFAULT,
					height: 58,
					paddingTop: 8,
				},
				tabBarIcon: ({ color, focused }) => {
					const [inactiveIcon, activeIcon] = TABBAR_ICONS[route.name];

					return (
						<Ionicons
							name={focused ? activeIcon : inactiveIcon}
							size={24}
							color={color}
						/>
					);
				},
			})}>
			<Tabs.Screen name="index" />
			<Tabs.Screen name="cart" />
			<Tabs.Screen name="wishlist" />
			<Tabs.Screen name="profile" />
		</Tabs>
	);
};

export default TabLayout;
