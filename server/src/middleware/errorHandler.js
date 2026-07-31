const errorHandler = (error, _req, res, _next) => {
	const status = error?.status || 500;
	const message = status < 500 ? error?.message : !error?.message ? 'Something went wrong.' : error?.message;

	const errorMessage = {
		name: error?.name || '',
		message,
		status,
		timestamp: error?.timestamp || '',
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
