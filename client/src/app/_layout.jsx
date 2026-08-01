import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { CatalogProvider } from '@/context/CatalogContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { COLORS } from '@/lib/colors';

const RootLayout = () => {
	return (
		<SafeAreaProvider>
			<SafeAreaView style={{ backgroundColor: COLORS.background.DEFAULT, flex: 1 }}>
				<AuthProvider>
					<CatalogProvider>
						<CartProvider>
							{/* <WishlistProvider> */}
								<Stack screenOptions={{ headerShown: false }} />
							{/* </WishlistProvider> */}
						</CartProvider>
					</CatalogProvider>
				</AuthProvider>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};

export default RootLayout;
