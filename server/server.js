import 'dotenv/config';
import express from 'express';
import logger from '#middleware/logger.js';
import apiRouter from '#routes/index.js';

const PORT = process.env.PORT || 3003;

const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(logger);

app.use('/api', apiRouter);

app.listen(PORT, () => {
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
