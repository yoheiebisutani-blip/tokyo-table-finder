// @ts-nocheck
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: restaurant, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !restaurant) {
      return Response.json(
        { error: 'not_found', message: 'Restaurant not found' },
        { status: 404 }
      )
    }

    return Response.json(restaurant)
  } catch (err) {
    console.error('GET /api/restaurants/[id] error:', err)
    return Response.json(
      { error: 'server_error', message: 'Internal server error' },
      { status: 500 }
    )
  }
}
