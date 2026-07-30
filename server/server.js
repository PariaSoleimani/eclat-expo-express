import 'dotenv/config';
import express from 'express';
import logger from './middleware/logger.js';
import routes from './routes/test.js';

const PORT = process.env.PORT || 3003;

const app = express();
routes(app);

app.use(logger);

app.listen(PORT, () => {
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
