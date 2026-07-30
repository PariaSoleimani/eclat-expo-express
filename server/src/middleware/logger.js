const logger = (req, _res, next) => {
	console.log(`${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`);
	next();
};

export default logger;
