// @ts-nocheck
import { verifyWebhookSignature } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return Response.json(
        { error: 'invalid_request', message: 'Missing stripe-signature header' },
        { status: 400 }
      )
    }

    let event
    try {
      event = verifyWebhookSignature(body, signature)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return Response.json(
        { error: 'invalid_signature', message: 'Invalid webhook signature' },
        { status: 400 }
      )
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as unknown as {
        id: string
        metadata: Record<string, string>
      }

      const user_id = session.metadata.user_id
      const pass_type = session.metadata.pass_type
      const restaurant_id = session.metadata.restaurant_id
      const serviceClient = createServiceClient()

      if (['7day', '14day', '30day'].includes(pass_type)) {
        const daysMap: Record<string, number> = {
          '7day': 7,
          '14day': 14,
          '30day': 30,
        }
        const days = daysMap[pass_type]
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + days)

        await serviceClient.from('passes').insert({
          user_id,
          pass_type: pass_type as '7day' | '14day' | '30day',
          stripe_session_id: session.id,
          expires_at: expiresAt.toISOString(),
        })
      } else if (pass_type === 'single') {
        await serviceClient.from('per_use_charges').insert({
          user_id,
          restaurant_id: restaurant_id || null,
          stripe_session_id: session.id,
        })
      }
    }

    return Response.json({ received: true })
  } catch (err) {
    console.error('POST /api/webhooks/stripe error:', err)
    return Response.json(
      { error: 'server_error', message: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
