import 'dotenv/config';
import express from 'express';
import logger from '#middleware/logger.js';
import routes from '#routes/health.js';

const PORT = process.env.PORT || 3003;

const app = express();
app.disable('x-powered-by');
app.use(express.json());
app.use(logger);

routes(app);

app.listen(PORT, () => {
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
