const errorHandler = (error, req, res, _next) => {
	const status = error?.status || 500;
	const message = status < 500 ? error?.message : !error?.message ? 'Something went wrong.' : error?.message;

	const errorMessage = {
		name: error?.name || '',
		url: req?.url || '',
		message,
		status,
		timestamp:
			error?.timestamp ||
			new Date().toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: false,
			}),
	};

	if (status >= 500) {
		console.error('Server Error'.red.bold, errorMessage);
	}

	return res.status(status).json({
		success: false,
		message,
	});
};

export default errorHandler;
