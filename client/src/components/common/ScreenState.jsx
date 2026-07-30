import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, Pressable, View } from 'react-native';
import { COLORS } from '@/lib/colors';

const ScreenState = ({ icon = 'sparkles-outline', title, description, actionLabel, onAction }) => (
	<View style={styles.container}>
		<Ionicons
			name={icon}
			size={36}
			color={COLORS.accent.DEFAULT}
		/>
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

const styles = StyleSheet.create({
	container: { alignItems: 'center', justifyContent: 'center', padding: 36, gap: 10 },
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
