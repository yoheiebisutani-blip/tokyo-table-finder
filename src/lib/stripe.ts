import Stripe from 'stripe'

function getStripeInstance(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
  }
  return new Stripe(secretKey)
}

export const PASS_PRICES: Record<string, { amount: number; label: string; days?: number }> = {
  '7day': { amount: 2900, label: '7-Day Pass ($29)', days: 7 },
  '14day': { amount: 4900, label: '14-Day Pass ($49)', days: 14 },
  '30day': { amount: 7900, label: '30-Day Pass ($79)', days: 30 },
}

export async function createCheckoutSession({
  userId,
  userEmail,
  passType,
  restaurantId,
  redirectTo,
}: {
  userId: string
  userEmail: string
  passType: string
  restaurantId?: string
  redirectTo?: string
}) {
  const stripe = getStripeInstance()
  const priceInfo = PASS_PRICES[passType]

  if (!priceInfo) {
    throw new Error(`Invalid pass type: ${passType}`)
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const successUrl = new URL(`${appUrl}/checkout/success`)
  successUrl.searchParams.set('session_id', '{CHECKOUT_SESSION_ID}')
  successUrl.searchParams.set('pass_type', passType)
  if (redirectTo) {
    successUrl.searchParams.set('redirect_to', redirectTo)
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: userEmail,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: priceInfo.label,
            description: `Tokyo Table Finder - ${priceInfo.label}`,
          },
          unit_amount: priceInfo.amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl.toString(),
    cancel_url: `${appUrl}/checkout/cancel`,
    metadata: {
      user_id: userId,
      pass_type: passType,
      ...(restaurantId && { restaurant_id: restaurantId }),
    },
  })

  return session
}

export function verifyWebhookSignature(body: string, signature: string): Stripe.Event {
  const stripe = getStripeInstance()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not set in environment variables')
  }

  return stripe.webhooks.constructEvent(body, signature, webhookSecret)
}
