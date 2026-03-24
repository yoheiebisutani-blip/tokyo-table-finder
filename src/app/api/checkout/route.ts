// @ts-nocheck
import { requireAuth } from '@/lib/auth'
import { createCheckoutSession, PASS_PRICES } from '@/lib/stripe'
import type { CheckoutRequest } from '@/types/api'

export async function POST(request: Request) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const body: CheckoutRequest = await request.json()

    if (!body.pass_type || !PASS_PRICES[body.pass_type]) {
      return Response.json(
        { error: 'validation_error', message: 'Invalid pass_type. Must be 7day, 14day, 30day, or single.' },
        { status: 400 }
      )
    }

    if (body.pass_type === 'single' && !body.restaurant_id) {
      return Response.json(
        { error: 'validation_error', message: 'restaurant_id is required for single message purchase.' },
        { status: 400 }
      )
    }

    const session = await createCheckoutSession({
      userId: user!.id,
      userEmail: user!.email!,
      passType: body.pass_type,
      restaurantId: body.restaurant_id,
    })

    return Response.json({ url: session.url })
  } catch (err) {
    console.error('POST /api/checkout error:', err)
    return Response.json(
      { error: 'server_error', message: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
