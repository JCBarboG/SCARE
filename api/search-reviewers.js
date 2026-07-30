import { runReviewerSearch } from './lib/searchCore.js';

/**
 * Handler compatible con funciones serverless de Vercel.
 * POST /api/search-reviewers
 * Body: { title, authors: string[], yearFrom, yearTo }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Método no permitido' });
    return;
  }

  const { title, authors, yearFrom, yearTo } = req.body || {};

  if (!title || typeof title !== 'string') {
    res.status(400).json({ success: false, error: 'El título es obligatorio' });
    return;
  }

  const startedAt = Date.now();

  try {
    const reviewers = await runReviewerSearch({
      title,
      authors: Array.isArray(authors) ? authors : [],
      yearFrom: Number(yearFrom) || undefined,
      yearTo: Number(yearTo) || undefined,
    });

    res.status(200).json({
      success: true,
      reviewers,
      totalFound: reviewers.length,
      processingTime: `${Math.round((Date.now() - startedAt) / 1000)}s`,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message || 'Error interno' });
  }
}
