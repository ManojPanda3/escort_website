import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  const formData = await request.formData()
  const updates = Object.fromEntries(formData.entries())

  const { error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', session.user.id)

  if (error) {
    return NextResponse.json(
      { error: error.message },```typescript file="app/api/profile/route.ts"
error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }

  return NextResponse.json(
    { message: 'Profile updated successfully' },
    { status: 200 }
  )
}

