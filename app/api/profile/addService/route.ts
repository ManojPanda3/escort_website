import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id,current_offer,user_type")
    .eq("id", session.user.id)
    .single();

  if (userError) return NextResponse.json({ error: "Error while fetching user data", success: false, status: 500 }, { status: 500 })

  if (user.current_offer == null || user.user_type === "general") {
    return NextResponse.json({
      error: "Unauthorized! U can't upload services " + (user.current_offer ? "without offer" : "as generatl user"),
      success: false,
      status: 401
    }, { status: 401 });
  }

  const { service } = await request.json()

  const { data: { id }, error } = await supabase
    .from('services')
    .insert({
      owner: session.user.id,
      service
    }).select().single()

  if (error) {
    return NextResponse.json({ error: error.message, success: false, status: 400 }, { status: 400 })
  }

  return NextResponse.json({ success: true, id: id, status: 200 })
}

export async function DELETE(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await request.json()

  // First verify the service belongs to the user
  const { data: service } = await supabase
    .from('services')
    .select()
    .eq('id', id)
    .eq('owner', session.user.id)
    .single()

  if (!service) {
    return NextResponse.json({ error: 'Service not found or unauthorized' }, { status: 404 })
  }

  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id)
    .eq('owner', session.user.id) // Extra safety check

  if (error) {
    console.error('Delete service error:', error)
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
export const runtime = "edge"
