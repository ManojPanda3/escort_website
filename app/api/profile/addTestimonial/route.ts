import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try{  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const json = await request.json()
  const { to, comment } = json

  const { error } = await supabase
    .from('testimonials')
    .insert({
      owner: session.user.id,
      to,
      comment    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ success: true },{status:200})
}catch(error:any){
  return NextResponse.json({ success: false,message:error.message},{status:500})
}
}


