import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const MOCK_OTP = process.env.EXPO_PUBLIC_MOCK_OTP;
const ADMIN_PHONE = process.env.EXPO_PUBLIC_ADMIN_PHONE;

const normalizePhone = phone => {
	const digits = phone.replace(/\D/g, '');
	return digits ? `+${digits}` : '';
};

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [error, setError] = useState(null);

	const validateCredentials = useCallback(({ name, phone }) => {
		setError(null);

		const normalizedPhone = normalizePhone(phone);
		if (!name.trim() || normalizedPhone.length < 7) {
			setError('Enter your name and a valid phone number.');
			return false;
		}

		return true;
	}, []);

	const signIn = useCallback(
		({ name, phone }) => {
			if (!validateCredentials({ name, phone })) {
				return false;
			}

			const normalizedPhone = normalizePhone(phone);
			setUser({
				id: `local-${normalizedPhone}`,
				name: name.trim(),
				phone: normalizedPhone,
				isAdmin: normalizedPhone === ADMIN_PHONE,
			});
			return true;
		},
		[validateCredentials],
	);

	const verifyCode = useCallback(
		({ code, name, phone }) => {
			if (code !== MOCK_OTP) {
				setError('Invalid code');
				return false;
			}
			setError(null);
			return signIn({ name, phone });
		},
		[signIn],
	);

	const clearError = useCallback(() => setError(null), []);

	const signOut = useCallback(() => {
		setUser(null);
		clearError();
	}, [clearError]);

	const value = useMemo(
		() => ({
			user,
			error,
			clearError,
			isAuthenticated: Boolean(user),
			signIn,
			signOut,
			verifyCode,
			validateCredentials,
		}),
		[user, error, signIn, signOut, verifyCode, clearError, validateCredentials],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within AuthProvider.');
	}

	return context;
};
