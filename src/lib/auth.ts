// @ts-nocheck
import { createClient } from '@/lib/supabase/server'

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }
  return user
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    return {
      user: null,
      error: Response.json(
        { error: 'unauthorized', message: 'Authentication required' },
        { status: 401 }
      ),
    }
  }
  return { user, error: null }
}

export async function requirePass() {
  const { user, error } = await requireAuth()
  if (error) return { user: null, hasAccess: false, singleChargeId: undefined as string | undefined, error }

  const supabase = await createClient()

  // Check for active pass
  const { data: activePass } = await supabase
    .from('passes')
    .select('*')
    .eq('user_id', user!.id)
    .eq('is_active', true)
    .gte('expires_at', new Date().toISOString())
    .order('expires_at', { ascending: false })
    .limit(1)
    .single()

  if (activePass) {
    return { user, hasAccess: true, singleChargeId: undefined as string | undefined, error: null }
  }

  // Check for unused single-use charge
  const { data: singleCharge } = await supabase
    .from('per_use_charges')
    .select('*')
    .eq('user_id', user!.id)
    .eq('is_used', false)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (singleCharge) {
    return { user, hasAccess: true, singleChargeId: singleCharge.id, error: null }
  }

  return {
    user,
    hasAccess: false,
    singleChargeId: undefined as string | undefined,
    error: Response.json(
      {
        error: 'forbidden',
        message: 'A valid pass or single-use purchase is required to access this feature',
      },
      { status: 403 }
    ),
  }
}
