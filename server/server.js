import 'dotenv/config';
import cors from 'cors';
import 'colors';
import express from 'express';
import errorHandler from '#middleware/errorHandler.js';
import logger from '#middleware/logger.js';
import router from '#routes/index.js';

const PORT = process.env.PORT || 3003;
const NODE_ENV = process.env.NODE_ENV || 'development';

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:8081')
	.split(',')
	.map(origin => origin.trim())
	.filter(Boolean);

const app = express();
app.disable('x-powered-by');

if (NODE_ENV === 'development') {
	app.use(
		cors({
			origin: allowedOrigins,
			methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
			allowedHeaders: ['Content-Type', 'Authorization'],
		}),
	);
}

app.use(express.json());
app.use(logger);

app.use('/api/v1', router);
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.green.underline);
});
