// @ts-nocheck
import { requirePass } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { generateReservationMessage } from '@/lib/anthropic'
import { checkRateLimit } from '@/lib/rate-limit'
import type { GenerateMessageRequest } from '@/types/api'

export async function POST(request: Request) {
  try {
    // Rate limiting
    const rateLimitResult = checkRateLimit(request)
    if (!rateLimitResult.allowed) {
      return Response.json(
        { error: 'rate_limited', message: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Auth + pass check
    const { user, hasAccess, singleChargeId, error } = await requirePass()
    if (error) return error

    const body: GenerateMessageRequest = await request.json()

    if (!body.restaurant_name_ja || !body.date || !body.time || !body.party_size) {
      return Response.json(
        { error: 'validation_error', message: 'restaurant_name_ja, date, time, and party_size are required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Get user profile for name
    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, email')
      .eq('id', user!.id)
      .single()

    const userName = profile?.display_name || profile?.email || 'Guest'

    // Generate message via Claude API
    const result = await generateReservationMessage({
      restaurantNameJa: body.restaurant_name_ja,
      date: body.date,
      time: body.time,
      partySize: body.party_size,
      specialRequests: body.special_requests,
      allergies: body.allergies,
      userName,
    })

    // Save to database
    const { data: savedMessage, error: saveError } = await supabase
      .from('generated_messages')
      .insert({
        user_id: user!.id,
        restaurant_id: body.restaurant_id || null,
        restaurant_name: body.restaurant_name_ja,
        message_ja: result.message_ja,
        message_en: result.message_en,
        reservation_date: body.date,
        reservation_time: body.time,
        party_size: body.party_size,
        special_requests: body.special_requests || null,
        allergies: body.allergies || null,
      })
      .select()
      .single()

    if (saveError) {
      console.error('Failed to save message:', saveError)
    }

    // Mark single-use charge as used if applicable
    if (singleChargeId) {
      await supabase
        .from('per_use_charges')
        .update({ is_used: true })
        .eq('id', singleChargeId)
    }

    return Response.json({
      id: (savedMessage as Record<string, unknown>)?.id,
      message_ja: result.message_ja,
      message_en: result.message_en,
      restaurant_name: body.restaurant_name_ja,
    })
  } catch (err) {
    console.error('POST /api/ai/generate-message error:', err)
    return Response.json(
      { error: 'server_error', message: 'Failed to generate message. Please try again.' },
      { status: 500 }
    )
  }
}
