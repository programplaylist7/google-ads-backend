import rateLimit from "express-rate-limit";

// ✅ Limit: 10 requests per minute
export const adsRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // max 10 requests

  message: {
    success: false,
    message: "Too many requests. Try again later.",
  },

  standardHeaders: true,
  legacyHeaders: false,
});