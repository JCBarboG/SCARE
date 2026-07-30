import 'dotenv/config';
import express from 'express';
import { corsMiddleware } from './middleware/cors.js';
import { searchRateLimit } from './middleware/rate-limit.js';
import searchReviewersHandler from './search-reviewers.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(corsMiddleware);

app.post('/api/search-reviewers', searchRateLimit, searchReviewersHandler);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`SCARE backend escuchando en http://localhost:${PORT}`);
});
