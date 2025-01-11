import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${session.user.id}/${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from('stories')
    .upload(fileName, file)

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 })
  }

  const { data: { publicUrl } } = supabase.storage
    .from('stories')
    .getPublicUrl(fileName)

  const { error: dbError } = await supabase
    .from('stories')
    .insert({
      user_id: session.user.id,
      media_url: publicUrl,
      type: file.type.startsWith('video/') ? 'video' : 'image'
    })

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}

