// @ts-nocheck
import { type NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const supabase = await createClient()

    const { data: favorites, error: dbError } = await supabase
      .from('favorites')
      .select('*, restaurants(*)')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })

    if (dbError) {
      return Response.json(
        { error: 'database_error', message: 'Failed to fetch favorites' },
        { status: 500 }
      )
    }

    return Response.json(favorites)
  } catch (err) {
    console.error('GET /api/favorites error:', err)
    return Response.json(
      { error: 'server_error', message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const body = await request.json()

    if (!body.restaurant_id) {
      return Response.json(
        { error: 'validation_error', message: 'restaurant_id is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data, error: dbError } = await supabase
      .from('favorites')
      .insert({
        user_id: user!.id,
        restaurant_id: body.restaurant_id,
      })
      .select()
      .single()

    if (dbError) {
      if (dbError.code === '23505') {
        return Response.json(
          { error: 'duplicate', message: 'Restaurant is already in favorites' },
          { status: 409 }
        )
      }
      return Response.json(
        { error: 'database_error', message: 'Failed to add favorite' },
        { status: 500 }
      )
    }

    return Response.json(data, { status: 201 })
  } catch (err) {
    console.error('POST /api/favorites error:', err)
    return Response.json(
      { error: 'server_error', message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const body = await request.json()

    if (!body.restaurant_id) {
      return Response.json(
        { error: 'validation_error', message: 'restaurant_id is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    await supabase
      .from('favorites')
      .delete()
      .eq('user_id', user!.id)
      .eq('restaurant_id', body.restaurant_id)

    return Response.json({ success: true })
  } catch (err) {
    console.error('DELETE /api/favorites error:', err)
    return Response.json(
      { error: 'server_error', message: 'Internal server error' },
      { status: 500 }
    )
  }
}
