import SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { TOKEN_KEY } from '@/config';
import { deleteItem, getItem, setItem } from '@/lib/localStorage';

export const getStoredToken = async () => {
	if (Platform.OS === 'web') {
		const token = getItem(TOKEN_KEY);
		return token;
	}

	return SecureStore.getItemAsync(TOKEN_KEY);
};

export const setStoredToken = async token => {
	if (Platform.OS === 'web') {
		setItem(TOKEN_KEY, token);
		return;
	}

	await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const clearStoredToken = async () => {
	if (Platform.OS === 'web') {
		deleteItem(TOKEN_KEY);
		return;
	}

	await SecureStore.deleteItemAsync(TOKEN_KEY);
};
