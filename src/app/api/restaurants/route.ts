// @ts-nocheck
import { type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth'
import type { Restaurant } from '@/types/api'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const searchParams = request.nextUrl.searchParams

    const area = searchParams.get('area')
    const cuisine = searchParams.get('cuisine')
    const budgetMin = searchParams.get('budget_min')
    const budgetMax = searchParams.get('budget_max')

    let query = supabase.from('restaurants').select('*')

    if (area) {
      query = query.eq('area', area)
    }
    if (cuisine) {
      query = query.eq('cuisine', cuisine)
    }
    if (budgetMin) {
      query = query.gte('budget_max', parseInt(budgetMin))
    }
    if (budgetMax) {
      query = query.lte('budget_min', parseInt(budgetMax))
    }

    const { data, error } = await query.order('rating', {
      ascending: false,
      nullsFirst: false,
    })
    const restaurants = data as Restaurant[] | null

    if (error || !restaurants) {
      return Response.json(
        { error: 'database_error', message: 'Failed to fetch restaurants' },
        { status: 500 }
      )
    }

    // Filter premium restaurants for non-pass holders
    const user = await getUser()
    let filteredRestaurants = restaurants

    if (user) {
      const { data: activePass } = await supabase
        .from('passes')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .eq('pass_type', '30day')
        .gte('expires_at', new Date().toISOString())
        .limit(1)
        .single()

      if (!activePass) {
        filteredRestaurants = restaurants.filter((r) => !r.is_premium)
      }
    } else {
      filteredRestaurants = restaurants.filter((r) => !r.is_premium)
    }

    return Response.json(filteredRestaurants)
  } catch (err) {
    console.error('GET /api/restaurants error:', err)
    return Response.json(
      { error: 'server_error', message: 'Internal server error' },
      { status: 500 }
    )
  }
}
