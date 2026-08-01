import { useCallback, useEffect, useState } from 'react';
import { normalizeAddresses } from '@/lib/adapters/address';
import { useAuth } from '@/context/AuthContext';
import {
	createAddress as createAddressRequest,
	deleteAddress as deleteAddressRequest,
	getAddresses as getAddressesRequest,
	updateAddress as updateAddressRequest,
} from '@/services/addresses';

const useAddresses = () => {
	const { token, isAuthenticated } = useAuth();
	const [addresses, setAddresses] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const refetch = useCallback(async () => {
		if (!token) {
			setAddresses([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const data = await getAddressesRequest(token);
			setAddresses(normalizeAddresses(data));
		} catch (requestError) {
			setError(requestError.message);
		} finally {
			setIsLoading(false);
		}
	}, [token]);

	useEffect(() => {
		if (!isAuthenticated || !token) {
			setAddresses([]);
			setError(null);
			return;
		}

		refetch();
	}, [isAuthenticated, token, refetch]);

	const createAddress = useCallback(
		async address => {
			if (!token) {
				throw new Error('You must be signed in to manage addresses.');
			}

			setError(null);

			try {
				const data = await createAddressRequest(token, address);
				const nextAddresses = normalizeAddresses(data);
				setAddresses(nextAddresses);
				return nextAddresses;
			} catch (requestError) {
				setError(requestError.message);
				throw requestError;
			}
		},
		[token],
	);

	const updateAddress = useCallback(
		async (id, updates) => {
			if (!token) {
				throw new Error('You must be signed in to manage addresses.');
			}

			setError(null);

			try {
				const data = await updateAddressRequest(token, id, updates);
				const nextAddresses = normalizeAddresses(data);
				setAddresses(nextAddresses);
				return nextAddresses;
			} catch (requestError) {
				setError(requestError.message);
				throw requestError;
			}
		},
		[token],
	);

	const deleteAddress = useCallback(
		async id => {
			if (!token) {
				throw new Error('You must be signed in to manage addresses.');
			}

			setError(null);

			try {
				const data = await deleteAddressRequest(token, id);
				const nextAddresses = normalizeAddresses(data);
				setAddresses(nextAddresses);
				return nextAddresses;
			} catch (requestError) {
				setError(requestError.message);
				throw requestError;
			}
		},
		[token],
	);

	return {
		addresses,
		isLoading,
		error,
		refetch,
		createAddress,
		updateAddress,
		deleteAddress,
	};
};

export default useAddresses;
