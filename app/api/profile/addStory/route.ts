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
  const title = formData.get('title') as string

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${session.user.id}/${Date.now()}.${fileExt}`

  const { error: uploadError, data } = await supabase.storage
    .from('stories')
    .upload(fileName, file)

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 })
  }

  const { data: { publicUrl } } = supabase.storage
    .from('stories')
    .getPublicUrl(fileName)

  const isVideo = file.type.startsWith('video/')

  const { error: dbError } = await supabase
    .from('story')
    .insert({
      owner: session.user.id,
      url: publicUrl,
      title,
      isVideo
    })

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 400 })
  }

  return NextResponse.json({ success: true, url: publicUrl })
}

