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
	const { clearError, error, validateCredentials, verifyCode } = useAuth();
	const router = useRouter();

	const [name, setName] = useState('');
	const [phone, setPhone] = useState('');
	const [code, setCode] = useState('');
	const [step, setStep] = useState('details');

	const handleSendCode = () => {
		if (!validateCredentials({ name, phone })) {
			return;
		}
		setStep('otp');
	};

	const handleVerifyCode = () => {
		if (verifyCode({ code, name, phone })) {
			router.replace('/');
		}
	};

	const handleResetForm = () => {
		setCode('');
		clearError();
		setStep('details');
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
				<Text style={styles.brand}>ATELIER SOL</Text>
				<Text style={styles.title}>
					{step === 'details' ? 'Welcome to the collection' : 'Verify your number'}
				</Text>
				<Text style={styles.subtitle}>
					{step === 'details'
						? 'Enter your info to discover pieces made to be kept.'
						: `We sent a six-digit code to ${phone}.`}
				</Text>
				{step === 'details' ? (
					<View style={styles.form}>
						<Field
							label="Your name"
							value={name}
							onChangeText={setName}
							placeholder="Name"
							autoCapitalize="words"
						/>
						<Field
							label="Phone number"
							value={phone}
							onChangeText={setPhone}
							placeholder="+98 912 123 4567"
							keyboardType="phone-pad"
						/>
						{error ? <Text style={styles.error}>{error}</Text> : null}
						<Pressable
							style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
							onPress={handleSendCode}>
							<Text style={styles.buttonText}>Send verification code</Text>
						</Pressable>
					</View>
				) : (
					<View style={styles.form}>
						<Field
							label="Verification code"
							value={code}
							onChangeText={setCode}
							placeholder="123456"
							keyboardType="number-pad"
							maxLength={6}
						/>
						{error && <Text style={styles.error}>{error}</Text>}
						<Pressable
							style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
							onPress={handleVerifyCode}>
							<Text style={styles.buttonText}>Verify and enter</Text>
						</Pressable>
						<Pressable
							style={({ pressed }) => [styles.secondaryButton, pressed && styles.secondaryButtonPressed]}
							onPress={handleResetForm}>
							<Text style={styles.secondaryText}>Use a different number</Text>
						</Pressable>
					</View>
				)}
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
	form: { gap: 14, marginTop: 30 },
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
	buttonText: { color: COLORS.background.DEFAULT, fontSize: 15, fontWeight: '800' },
	secondaryButton: { alignItems: 'center', paddingVertical: 10 },
	secondaryButtonPressed: { opacity: 0.65 },
	secondaryText: { color: COLORS.accent[900], fontSize: 13, fontWeight: '800' },
});

export default AuthScreen;
