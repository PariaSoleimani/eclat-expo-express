import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { COLORS } from '@/lib/colors';

const Field = ({ label, ...props }) => (
	<View>
		<Text style={styles.label}>{label}</Text>
		<TextInput
			style={styles.input}
			placeholderTextColor={COLORS.secondary[300]}
			{...props}
		/>
	</View>
);

const AuthScreen = () => {
	const { clearError, error, isLoading, login, signup } = useAuth();
	const router = useRouter();

	const [mode, setMode] = useState('signup');
	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [password, setPassword] = useState('');

	const isSignup = mode === 'signup';

	const switchMode = nextMode => {
		setMode(nextMode);
		setPassword('');
		clearError();
	};

	const handleSubmit = async () => {
		const success = isSignup
			? await signup({ name, phone, password })
			: await login({ phone, password });

		if (success) {
			router.replace('/');
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={styles.screen}>
			<View style={styles.content}>
				<View style={styles.mark}>
					<Ionicons
						name="diamond"
						size={36}
						color={COLORS.accent.DEFAULT}
						style={{ transform: [{ translateY: 2 }] }}
					/>
				</View>
				<Text style={styles.brand}>ÉCLAT</Text>
				<Text style={styles.title}>{isSignup ? 'Create your account' : 'Welcome back'}</Text>
				<Text style={styles.subtitle}>
					{isSignup
						? 'Join Éclat and explore the world of luxury.'
						: 'Sign in with your phone number and password.'}
				</Text>

				<View style={styles.tabs}>
					<Pressable
						style={[styles.tab, !isSignup && styles.tabActive]}
						onPress={() => switchMode('login')}>
						<Text style={[styles.tabText, !isSignup && styles.tabTextActive]}>Log in</Text>
					</Pressable>
					<Pressable
						style={[styles.tab, isSignup && styles.tabActive]}
						onPress={() => switchMode('signup')}>
						<Text style={[styles.tabText, isSignup && styles.tabTextActive]}>Sign up</Text>
					</Pressable>
				</View>

				<View style={styles.form}>
					{isSignup && (
						<Field
							label="Your name"
							value={name}
							onChangeText={setName}
							placeholder="Name"
							autoCapitalize="words"
						/>
					)}
					<Field
						label="Phone number"
						value={phone}
						onChangeText={setPhone}
						placeholder="+98 912 123 4567"
						keyboardType="phone-pad"
						autoCapitalize="none"
					/>
					<Field
						label="Password"
						value={password}
						onChangeText={setPassword}
						placeholder={isSignup ? 'At least 8 characters' : 'Your password'}
						secureTextEntry
						autoCapitalize="none"
					/>
					{error && <Text style={styles.error}>{error}</Text>}
					<Pressable
						style={({ pressed }) => [
							styles.button,
							(pressed || isLoading) && styles.buttonPressed,
							isLoading && styles.buttonDisabled,
						]}
						disabled={isLoading}
						onPress={handleSubmit}>
						<Text style={styles.buttonText}>
							{isLoading ? 'Please wait…' : isSignup ? 'Create account' : 'Log in'}
						</Text>
					</Pressable>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
};

const styles = StyleSheet.create({
	screen: { backgroundColor: COLORS.background.DEFAULT, flex: 1, justifyContent: 'center' },
	content: { padding: 28 },
	mark: {
		backgroundColor: COLORS.primary[100],
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 32,
		height: 64,
		width: 64,
	},
	brand: { color: COLORS.primary.DEFAULT, fontSize: 14, fontWeight: '800', letterSpacing: 3, marginTop: 18 },
	title: { color: COLORS.primary.DEFAULT, fontSize: 29, fontWeight: '800', lineHeight: 35, marginTop: 14 },
	subtitle: {
		color: COLORS.secondary.DEFAULT,
		fontSize: 15,
		lineHeight: 22,
		marginTop: 9,
	},
	tabs: {
		backgroundColor: COLORS.primary[100],
		borderRadius: 14,
		flexDirection: 'row',
		marginTop: 28,
		padding: 4,
	},
	tab: { alignItems: 'center', borderRadius: 11, flex: 1, paddingVertical: 11 },
	tabActive: { backgroundColor: COLORS.background.DEFAULT },
	tabText: { color: COLORS.secondary.DEFAULT, fontSize: 13, fontWeight: '700' },
	tabTextActive: { color: COLORS.primary.DEFAULT },
	form: { gap: 14, marginTop: 22 },
	label: { color: COLORS.primary.DEFAULT, fontSize: 13, fontWeight: '800', marginBottom: 7 },
	input: {
		backgroundColor: COLORS.primary[100],
		borderRadius: 13,
		color: COLORS.primary.DEFAULT,
		fontSize: 16,
		height: 50,
		paddingHorizontal: 14,
	},
	error: { color: COLORS.error[600], fontSize: 13, fontWeight: '600' },
	button: {
		alignItems: 'center',
		backgroundColor: COLORS.primary.DEFAULT,
		borderRadius: 26,
		marginTop: 8,
		paddingVertical: 16,
	},
	buttonPressed: { opacity: 0.86, transform: [{ scale: 0.98 }] },
	buttonDisabled: { opacity: 0.7 },
	buttonText: { color: COLORS.background.DEFAULT, fontSize: 15, fontWeight: '800' },
});

export default AuthScreen;
