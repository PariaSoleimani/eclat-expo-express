const errorHandler = (error, _req, res, _next) => {
	const status = error.status || 500;
	const message = status < 500 ? error.message : 'Something went wrong.';

	if (status >= 500) {
		console.error(error);
	}

	return res.status(status).json({
		success: false,
		message,
	});
};

export default errorHandler;
