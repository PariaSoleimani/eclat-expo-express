import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '@/lib/colors';

const CategoryItem = ({ item, onPress }) => {
	return (
		<Pressable
			style={styles.container}
			onPress={onPress}>
			<View style={styles.iconWrap}>
				<Ionicons
					name={item.icon ?? 'sparkles-outline'}
					size={23}
					color={COLORS.primary.DEFAULT}
				/>
			</View>
			<Text style={styles.label}>{item.name}</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	container: { alignItems: 'center', marginRight: 16, width: 64 },
	iconWrap: {
		alignItems: 'center',
		backgroundColor: COLORS.primary[100],
		borderRadius: 28,
		height: 56,
		justifyContent: 'center',
		width: 56,
	},
	label: {
		color: COLORS.secondary.DEFAULT,
		fontSize: 11,
		fontWeight: '600',
		marginTop: 7,
		textAlign: 'center',
	},
});

export default CategoryItem;
