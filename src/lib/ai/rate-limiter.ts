/**
 * Simple in-memory rate limiter for Anthropic API calls.
 * Configurable via environment variables:
 *   - ANTHROPIC_CALL_LIMIT: max number of API calls allowed (default: 100)
 *   - ANTHROPIC_CALL_LIMIT_WINDOW_HOURS: reset window in hours (0 = never reset, default: 0)
 */

interface UsageStats {
  callCount: number;
  limit: number;
  remaining: number;
  windowStart: number;
  windowHours: number;
}

let callCount = 0;
let windowStart = Date.now();

function getLimit(): number {
  return parseInt(process.env.ANTHROPIC_CALL_LIMIT || '100', 10);
}

function getWindowHours(): number {
  return parseFloat(process.env.ANTHROPIC_CALL_LIMIT_WINDOW_HOURS || '0');
}

function maybeResetWindow(): void {
  const windowHours = getWindowHours();
  if (windowHours <= 0) return;

  const windowMs = windowHours * 60 * 60 * 1000;
  if (Date.now() - windowStart >= windowMs) {
    callCount = 0;
    windowStart = Date.now();
  }
}

/**
 * Check if an API call is allowed. Throws if limit is exceeded.
 * Call this before each Anthropic API call.
 */
export function checkRateLimit(): void {
  maybeResetWindow();
  const limit = getLimit();

  if (callCount >= limit) {
    const stats = getUsageStats();
    throw new RateLimitError(
      'AI usage limit reached. Please try again later.',
      stats
    );
  }
}

/**
 * Record that an API call was made. Call this after a successful Anthropic API call.
 */
export function recordCall(): void {
  maybeResetWindow();
  callCount++;
}

/**
 * Get current usage statistics.
 */
export function getUsageStats(): UsageStats {
  maybeResetWindow();
  const limit = getLimit();
  return {
    callCount,
    limit,
    remaining: Math.max(0, limit - callCount),
    windowStart,
    windowHours: getWindowHours(),
  };
}

/**
 * Manually reset the call counter (e.g., for admin use).
 */
export function resetUsage(): void {
  callCount = 0;
  windowStart = Date.now();
}

export class RateLimitError extends Error {
  public stats: UsageStats;

  constructor(message: string, stats: UsageStats) {
    super(message);
    this.name = 'RateLimitError';
    this.stats = stats;
  }
}
