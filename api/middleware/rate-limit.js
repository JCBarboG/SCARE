import rateLimit from 'express-rate-limit';

export const searchRateLimit = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  max: Number(process.env.RATE_LIMIT_MAX || 20),
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Demasiadas búsquedas. Intenta de nuevo más tarde.' },
});
