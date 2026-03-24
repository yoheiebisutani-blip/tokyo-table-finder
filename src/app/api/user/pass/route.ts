// @ts-nocheck
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const { user, error } = await requireAuth()
    if (error) return error

    const supabase = await createClient()

    const { data: activePass } = await supabase
      .from('passes')
      .select('*')
      .eq('user_id', user!.id)
      .eq('is_active', true)
      .gte('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: false })
      .limit(1)
      .single()

    if (!activePass) {
      return Response.json({
        has_active_pass: false,
        pass_type: null,
        expires_at: null,
        days_remaining: null,
      })
    }

    const now = new Date()
    const expiresAt = new Date(activePass.expires_at)
    const daysRemaining = Math.ceil(
      (expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    )

    return Response.json({
      has_active_pass: true,
      pass_type: activePass.pass_type,
      expires_at: activePass.expires_at,
      days_remaining: Math.max(0, daysRemaining),
    })
  } catch (err) {
    console.error('GET /api/user/pass error:', err)
    return Response.json(
      { error: 'server_error', message: 'Internal server error' },
      { status: 500 }
    )
  }
}
