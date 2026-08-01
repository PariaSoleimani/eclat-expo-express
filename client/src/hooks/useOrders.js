import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
	createOrder as createOrderRequest,
	getOrderById as getOrderByIdRequest,
	getOrders as getOrdersRequest,
} from '@/services/orders';

const useOrders = () => {
	const { token, isAuthenticated } = useAuth();
	const [orders, setOrders] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const refetch = useCallback(async () => {
		if (!token) {
			setOrders([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const data = await getOrdersRequest(token);
			setOrders(data);
		} catch (requestError) {
			setError(requestError.message);
		} finally {
			setIsLoading(false);
		}
	}, [token]);

	useEffect(() => {
		if (!isAuthenticated || !token) {
			setOrders([]);
			setError(null);
			return;
		}

		refetch();
	}, [isAuthenticated, token, refetch]);

	const createOrder = useCallback(
		async payload => {
			if (!token) {
				throw new Error('You must be signed in to place an order.');
			}

			setError(null);

			try {
				const order = await createOrderRequest(token, payload);
				await refetch();
				return order;
			} catch (requestError) {
				setError(requestError.message);
				throw requestError;
			}
		},
		[refetch, token],
	);

	return {
		orders,
		isLoading,
		error,
		refetch,
		createOrder,
	};
};

export const useOrder = id => {
	const { token, isAuthenticated } = useAuth();
	const [order, setOrder] = useState(null);
	const [isLoading, setIsLoading] = useState(Boolean(id));
	const [error, setError] = useState(null);

	const refetch = useCallback(async () => {
		if (!token || !id) {
			setOrder(null);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const data = await getOrderByIdRequest(token, id);
			setOrder(data);
		} catch (requestError) {
			setOrder(null);
			setError(requestError.message);
		} finally {
			setIsLoading(false);
		}
	}, [id, token]);

	useEffect(() => {
		if (!isAuthenticated || !token) {
			setOrder(null);
			setError(null);
			return;
		}

		refetch();
	}, [isAuthenticated, token, refetch]);

	return {
		order,
		isLoading,
		error,
		refetch,
	};
};

export default useOrders;
