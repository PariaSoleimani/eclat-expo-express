import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from 'react-native';
import ScreenState from '@/components/common/ScreenState';
import Header from '@/components/Header';
import useAddresses from '@/hooks/useAddresses';
import { COLORS } from '@/lib/colors';

const createAddressForm = address => ({
	label: address.label ?? '',
	recipient: address.recipient ?? '',
	line1: address.line1 ?? '',
	line2: address.line2 ?? '',
	city: address.city ?? '',
	postalCode: address.postalCode ?? '',
	country: address.country ?? '',
});

const FormField = ({ label, onChangeText, value, ...props }) => (
	<View style={styles.field}>
		<Text style={styles.fieldLabel}>{label}</Text>
		<TextInput
			{...props}
			onChangeText={onChangeText}
			placeholderTextColor={COLORS.secondary[300]}
			style={styles.input}
			value={value}
		/>
	</View>
);

const AddressesScreen = () => {
	const { addresses, deleteAddress, updateAddress } = useAddresses();
	const [openMenuId, setOpenMenuId] = useState(null);
	const [editingAddress, setEditingAddress] = useState(null);
	const [form, setForm] = useState(null);

	const openEditor = address => {
		setOpenMenuId(null);
		setEditingAddress(address);
		setForm(createAddressForm(address));
	};

	const saveAddress = () => {
		if (!editingAddress || !form) {
			return;
		}

		updateAddress(editingAddress.id, {
			label: form.label.trim(),
			recipient: form.recipient.trim(),
			details: form.line1.trim(),
			city: form.city.trim(),
			postalCode: form.postalCode.trim(),
			country: form.country.trim(),
		});
		setEditingAddress(null);
		setForm(null);
	};

	const updateField = field => value => setForm(current => ({ ...current, [field]: value }));
	const canSave =
		form && ['label', 'recipient', 'line1', 'city', 'postalCode', 'country'].every(field => form[field].trim());

	return (
		<View style={styles.screen}>
			<Header
				title="Delivery addresses"
				showBack
				showCart
			/>
			{addresses.length === 0 ? (
				<ScreenState
					icon="location-outline"
					title="No saved addresses"
					description="Your delivery addresses will be saved here after checkout."
				/>
			) : (
				<ScrollView contentContainerStyle={styles.content}>
					{addresses.map(address => (
						<View
							key={address.id}
							style={styles.address}>
							<View style={styles.addressHeader}>
								<View style={styles.label}>
									<Ionicons
										name="home-outline"
										size={16}
										color={COLORS.primary.DEFAULT}
									/>
									<Text style={styles.labelText}>{address.label}</Text>
								</View>
								<View style={styles.addressActions}>
									{address.isDefault ? <Text style={styles.default}>Default</Text> : null}
									<Pressable
										hitSlop={8}
										onPress={() =>
											setOpenMenuId(current => (current === address.id ? null : address.id))
										}
										style={styles.menuButton}>
										<Ionicons
											name="ellipsis-horizontal"
											size={20}
											color={COLORS.primary.DEFAULT}
										/>
									</Pressable>
								</View>
							</View>
							<Text style={styles.recipient}>{address.recipient}</Text>
							<Text style={styles.detail}>{address.line1}</Text>
							{address.line2 ? <Text style={styles.detail}>{address.line2}</Text> : null}
							<Text style={styles.detail}>
								{address.city}, {address.postalCode}
							</Text>
							<Text style={styles.detail}>{address.country}</Text>
							{openMenuId === address.id ? (
								<View style={styles.popover}>
									<Pressable
										onPress={() => openEditor(address)}
										style={styles.popoverItem}>
										<Ionicons
											name="pencil-outline"
											size={17}
											color={COLORS.primary.DEFAULT}
										/>
										<Text style={styles.popoverText}>Edit</Text>
									</Pressable>
									<Pressable
										onPress={() => {
											deleteAddress(address.id);
											setOpenMenuId(null);
										}}
										style={styles.popoverItem}>
										<Ionicons
											name="trash-outline"
											size={17}
											color={COLORS.error[600]}
										/>
										<Text style={styles.deleteText}>Delete</Text>
									</Pressable>
								</View>
							) : null}
						</View>
					))}
				</ScrollView>
			)}
			<Modal
				animationType="fade"
				onRequestClose={() => setEditingAddress(null)}
				transparent
				visible={Boolean(editingAddress && form)}>
				<KeyboardAvoidingView
					behavior={Platform.OS === 'ios' ? 'padding' : undefined}
					style={styles.modalOverlay}>
					<View style={styles.modal}>
						<View style={styles.modalHeader}>
							<Text style={styles.modalTitle}>Edit address</Text>
							<Pressable
								hitSlop={8}
								onPress={() => setEditingAddress(null)}>
								<Ionicons
									name="close"
									size={23}
									color={COLORS.primary.DEFAULT}
								/>
							</Pressable>
						</View>
						<ScrollView showsVerticalScrollIndicator={false}>
							<FormField
								label="Address label"
								onChangeText={updateField('label')}
								value={form?.label ?? ''}
							/>
							<FormField
								label="Recipient"
								onChangeText={updateField('recipient')}
								value={form?.recipient ?? ''}
							/>
							<FormField
								label="Address line"
								onChangeText={updateField('line1')}
								value={form?.line1 ?? ''}
							/>
							<FormField
								label="Apartment, suite, etc. (optional)"
								onChangeText={updateField('line2')}
								value={form?.line2 ?? ''}
							/>
							<FormField
								label="City"
								onChangeText={updateField('city')}
								value={form?.city ?? ''}
							/>
							<FormField
								label="Postal code"
								onChangeText={updateField('postalCode')}
								value={form?.postalCode ?? ''}
							/>
							<FormField
								label="Country"
								onChangeText={updateField('country')}
								value={form?.country ?? ''}
							/>
						</ScrollView>
						<Pressable
							disabled={!canSave}
							onPress={saveAddress}
							style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}>
							<Text style={styles.saveButtonText}>Save changes</Text>
						</Pressable>
					</View>
				</KeyboardAvoidingView>
			</Modal>
		</View>
	);
};

const styles = StyleSheet.create({
	screen: { backgroundColor: COLORS.background.DEFAULT, flex: 1 },
	content: { padding: 18 },
	address: { backgroundColor: COLORS.surface.DEFAULT, borderRadius: 16, marginBottom: 12, padding: 18 },
	addressHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
	label: { alignItems: 'center', flexDirection: 'row', gap: 7 },
	labelText: { color: COLORS.primary.DEFAULT, fontSize: 13, fontWeight: '800' },
	addressActions: { alignItems: 'center', flexDirection: 'row', gap: 8 },
	default: { color: COLORS.accent[900], fontSize: 11, fontWeight: '800' },
	menuButton: { padding: 2 },
	recipient: { color: COLORS.primary.DEFAULT, fontSize: 15, fontWeight: '800', marginBottom: 7 },
	detail: { color: COLORS.secondary.DEFAULT, fontSize: 13, lineHeight: 20 },
	popover: {
		backgroundColor: COLORS.surface.DEFAULT,
		borderColor: COLORS.border.DEFAULT,
		borderRadius: 12,
		borderWidth: 1,
		elevation: 5,
		position: 'absolute',
		right: 14,
		shadowColor: COLORS.primary.DEFAULT,
		shadowOffset: { height: 3, width: 0 },
		shadowOpacity: 0.12,
		shadowRadius: 8,
		top: 47,
		width: 126,
		zIndex: 1,
	},
	popoverItem: { alignItems: 'center', flexDirection: 'row', gap: 9, paddingHorizontal: 13, paddingVertical: 12 },
	popoverText: { color: COLORS.primary.DEFAULT, fontSize: 13, fontWeight: '700' },
	deleteText: { color: COLORS.error[600], fontSize: 13, fontWeight: '700' },
	modalOverlay: {
		alignItems: 'center',
		backgroundColor: 'rgba(33, 28, 23, 0.45)',
		flex: 1,
		justifyContent: 'center',
		padding: 18,
	},
	modal: {
		backgroundColor: COLORS.background.DEFAULT,
		borderRadius: 20,
		maxHeight: '85%',
		padding: 20,
		width: '100%',
	},
	modalHeader: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 18 },
	modalTitle: { color: COLORS.primary.DEFAULT, fontSize: 20, fontWeight: '800' },
	field: { marginBottom: 13 },
	fieldLabel: { color: COLORS.primary.DEFAULT, fontSize: 12, fontWeight: '700', marginBottom: 6 },
	input: {
		backgroundColor: COLORS.surface.DEFAULT,
		borderColor: COLORS.border.DEFAULT,
		borderRadius: 10,
		borderWidth: 1,
		color: COLORS.primary.DEFAULT,
		fontSize: 15,
		paddingHorizontal: 13,
		paddingVertical: 11,
	},
	saveButton: {
		alignItems: 'center',
		backgroundColor: COLORS.primary.DEFAULT,
		borderRadius: 12,
		marginTop: 8,
		paddingVertical: 14,
	},
	saveButtonDisabled: { opacity: 0.45 },
	saveButtonText: { color: COLORS.background.DEFAULT, fontSize: 14, fontWeight: '800' },
});

export default AddressesScreen;
