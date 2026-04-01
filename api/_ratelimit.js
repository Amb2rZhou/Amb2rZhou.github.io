// Simple in-memory rate limiter for Vercel serverless functions
// Persists within a warm function instance

const ipRecords = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS = 10; // max 10 requests per minute per IP

export function rateLimit(req) {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
  const now = Date.now();

  if (!ipRecords.has(ip)) {
    ipRecords.set(ip, []);
  }

  const timestamps = ipRecords.get(ip).filter(t => now - t < WINDOW_MS);
  timestamps.push(now);
  ipRecords.set(ip, timestamps);

  // Clean up old IPs periodically
  if (ipRecords.size > 1000) {
    for (const [key, val] of ipRecords) {
      if (val.every(t => now - t > WINDOW_MS)) ipRecords.delete(key);
    }
  }

  return timestamps.length <= MAX_REQUESTS;
}
