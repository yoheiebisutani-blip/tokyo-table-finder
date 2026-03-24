// Simple in-memory rate limiter (IP-based, 10 requests per minute)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const WINDOW_MS = 60 * 1000 // 1 minute
const MAX_REQUESTS = 10

export function checkRateLimit(request: Request): { allowed: boolean } {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown'

  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true }
  }

  entry.count++
  if (entry.count > MAX_REQUESTS) {
    return { allowed: false }
  }

  return { allowed: true }
}
