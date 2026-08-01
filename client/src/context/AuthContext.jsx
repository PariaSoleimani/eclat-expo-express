import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { clearStoredToken, getStoredToken, setStoredToken } from '@/lib/tokenStorage';
import { getCurrentUser, login as loginRequest, signup as signupRequest } from '@/services/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [user, setUser] = useState(null);
	const [token, setToken] = useState(null);
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);

	const clearError = useCallback(() => setError(null), []);

	const applyAuth = useCallback(async ({ token, user }) => {
		await setStoredToken(token);
		setIsAuthenticated(true);
		setToken(token);
		setUser(user);
		setError(null);
	}, []);

	const clearAuth = useCallback(async () => {
		await clearStoredToken();
		setIsAuthenticated(false);
		setToken(null);
		setUser(null);
		setError(null);
	}, []);

	const restoreSession = useCallback(async () => {
		try {
			const storedToken = await getStoredToken();

			
			if (!storedToken) {
				return;
			}
			
			const currentUser = await getCurrentUser(storedToken);

			setIsAuthenticated(true);
			setToken(storedToken);
			setUser(currentUser);
		} catch {
			await clearStoredToken();
			setIsAuthenticated(false);
			setToken(null);
			setUser(null);
		}
	}, []);

	useEffect(() => {
		restoreSession();
	}, [restoreSession]);

	const login = useCallback(
		async ({ phone, password }) => {
			setIsLoading(true);
			setError(null);

			try {
				const result = await loginRequest({ phone, password });
				await applyAuth(result);
				return true;
			} catch (requestError) {
				setError(requestError.message);
				return false;
			} finally {
				setIsLoading(false);
			}
		},
		[applyAuth],
	);

	const signup = useCallback(
		async ({ name, phone, password }) => {
			setIsLoading(true);
			setError(null);

			try {
				const result = await signupRequest({ name, phone, password });
				await applyAuth(result);
				return true;
			} catch (requestError) {
				setError(requestError.message);
				return false;
			} finally {
				setIsLoading(false);
			}
		},
		[applyAuth],
	);

	const signOut = useCallback(async () => {
		await clearAuth();
	}, [clearAuth]);

	const value = useMemo(
		() => ({
			user,
			token,
			error,
			isLoading,
			clearError,
			isAuthenticated,
			login,
			signup,
			signOut,
		}),
		[user, token, error, isLoading, isAuthenticated, clearError, login, signup, signOut],
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
