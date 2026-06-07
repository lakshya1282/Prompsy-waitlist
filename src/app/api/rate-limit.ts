export const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

/**
 * Basic in-memory rate limiter.
 * Note: In serverless environments, this only limits per-instance, 
 * but provides a basic level of protection against brute-force spam.
 * 
 * @param ip Client IP address
 * @param limit Max requests
 * @param windowMs Time window in milliseconds
 * @returns boolean True if allowed, false if rate limited
 */
export function isRateLimited(ip: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  // Reset window if time has passed
  if (now - record.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  // Check limit
  if (record.count >= limit) {
    return true; // Rate limited
  }

  // Increment count
  record.count++;
  return false;
}
