import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/lib/colors';

const ScreenState = ({ mode = 'empty', icon, title, description, actionLabel, onAction }) => {
	const iconName = icon ?? (mode === 'error' ? 'cloud-offline-outline' : 'sparkles-outline');

	return (
		<View style={styles.container}>
			{mode === 'loading' ? (
				<ActivityIndicator
					color={COLORS.accent.DEFAULT}
					size="large"
				/>
			) : (
				<Ionicons
					name={iconName}
					size={36}
					color={COLORS.accent.DEFAULT}
				/>
			)}
			<Text style={styles.title}>{title}</Text>
			{description && <Text style={styles.description}>{description}</Text>}
			{actionLabel && onAction && (
				<Pressable
					style={styles.action}
					onPress={onAction}>
					<Text style={styles.actionText}>{actionLabel}</Text>
				</Pressable>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: { alignItems: 'center', justifyContent: 'center', padding: 36, gap: 10, flex: 1 },
	title: { color: COLORS.primary.DEFAULT, fontSize: 18, fontWeight: '700' },
	description: {
		color: COLORS.secondary.DEFAULT,
		fontSize: 14,
		lineHeight: 20,
		textAlign: 'center',
	},
	action: {
		backgroundColor: COLORS.primary.DEFAULT,
		borderRadius: 24,
		marginTop: 8,
		paddingHorizontal: 20,
		paddingVertical: 11,
	},
	actionText: { color: COLORS.background.DEFAULT, fontSize: 13, fontWeight: '700' },
});

export default ScreenState;
