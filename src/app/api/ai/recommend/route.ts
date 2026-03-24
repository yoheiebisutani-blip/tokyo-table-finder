// @ts-nocheck
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { createServiceClient } from '@/lib/supabase/server'
import { generateRecommendations } from '@/lib/anthropic'
import { checkRateLimit } from '@/lib/rate-limit'
import type { RecommendRequest } from '@/types/api'

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

    const { user, error } = await requireAuth()
    if (error) return error

    const supabase = await createClient()
    const serviceClient = createServiceClient()

    // Check daily usage for free users
    const { data: activePass } = await supabase
      .from('passes')
      .select('id')
      .eq('user_id', user!.id)
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString())
      .limit(1)
      .single()

    if (!activePass) {
      const today = new Date().toISOString().split('T')[0]
      const { data: usage } = await supabase
        .from('daily_usage')
        .select('recommend_count')
        .eq('user_id', user!.id)
        .eq('usage_date', today)
        .single()

      if (usage && usage.recommend_count >= 1) {
        return Response.json(
          {
            error: 'usage_limit',
            message: 'Free users can get 1 AI recommendation per day. Upgrade to a pass for unlimited access.',
          },
          { status: 403 }
        )
      }
    }

    const body: RecommendRequest = await request.json()

    // Fetch restaurants matching filters
    let query = supabase.from('restaurants').select('*')
    if (body.area) query = query.eq('area', body.area)
    if (body.cuisine) query = query.eq('cuisine', body.cuisine)
    if (body.budget_max) query = query.lte('budget_min', body.budget_max)

    const { data: restaurants, error: dbError } = await query.limit(20)

    if (dbError || !restaurants || restaurants.length === 0) {
      return Response.json(
        { error: 'no_results', message: 'No restaurants found matching your criteria.' },
        { status: 404 }
      )
    }

    // Generate recommendations via Claude
    const recommendations = await generateRecommendations({
      restaurants: restaurants.map((r) => ({
        id: r.id,
        name_en: r.name_en,
        name_ja: r.name_ja,
        cuisine: r.cuisine,
        area: r.area,
        budget_min: r.budget_min,
        budget_max: r.budget_max,
        description_en: r.description_en,
      })),
      area: body.area,
      cuisine: body.cuisine,
      budgetMax: body.budget_max,
      preferences: body.preferences,
    })

    // Map recommendations to include full restaurant data
    const result = recommendations
      .map((rec) => {
        const restaurant = restaurants.find((r) => r.id === rec.restaurant_id)
        if (!restaurant) return null
        return { restaurant, reason: rec.reason }
      })
      .filter(Boolean)

    // Update daily usage (via service client to bypass RLS)
    if (!activePass) {
      const today = new Date().toISOString().split('T')[0]
      const { data: existing } = await serviceClient
        .from('daily_usage')
        .select('id, recommend_count')
        .eq('user_id', user!.id)
        .eq('usage_date', today)
        .single()

      if (existing) {
        await serviceClient
          .from('daily_usage')
          .update({ recommend_count: existing.recommend_count + 1 })
          .eq('id', existing.id)
      } else {
        await serviceClient.from('daily_usage').insert({
          user_id: user!.id,
          usage_date: today,
          recommend_count: 1,
        })
      }
    }

    return Response.json({ recommendations: result })
  } catch (err) {
    console.error('POST /api/ai/recommend error:', err)
    return Response.json(
      { error: 'server_error', message: 'Failed to generate recommendations. Please try again.' },
      { status: 500 }
    )
  }
}
