import { Stack } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from '@/context/AuthContext';
// import { MockDataProvider } from '@/context/MockDataContext';
import { COLORS } from '@/lib/colors';

const RootLayout = () => {
	return (
		<SafeAreaProvider>
			<SafeAreaView style={{ backgroundColor: COLORS.background.DEFAULT, flex: 1 }}>
				<AuthProvider>
				
						<Stack screenOptions={{ headerShown: false }} />
		
				</AuthProvider>
			</SafeAreaView>
		</SafeAreaProvider>
	);
};

export default RootLayout;
