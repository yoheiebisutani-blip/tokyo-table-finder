// @ts-nocheck
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const supabase = await createClient()

    const { data: messages, error: dbError } = await supabase
      .from('generated_messages')
      .select('*')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false })

    if (dbError) {
      return Response.json(
        { error: 'database_error', message: 'Failed to fetch messages' },
        { status: 500 }
      )
    }

    return Response.json(messages)
  } catch (err) {
    console.error('GET /api/messages error:', err)
    return Response.json(
      { error: 'server_error', message: 'Internal server error' },
      { status: 500 }
    )
  }
}
