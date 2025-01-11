import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  if (body.profile_picture && body.profile_picture.startsWith('data:image')) {
    const base64FileData = body.profile_picture.split('base64,')[1]
    const fileExt = body.profile_picture.split(';')[0].split('/')[1]
    const fileName = `${session.user.id}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('public_asset')
      .upload(fileName, Buffer.from(base64FileData, 'base64'), {
        contentType: `image/${fileExt}`,
        upsert: true
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('public_asset')
      .getPublicUrl(fileName)

    body.profile_picture = publicUrl
  }

  // Handle cover image upload if present
  if (body.cover_image && body.cover_image.startsWith('data:image')) {
    const base64FileData = body.cover_image.split('base64,')[1]
    const fileExt = body.cover_image.split(';')[0].split('/')[1]
    const fileName = `${session.user.id}/${Date.now()}-cover.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('public_asset')
      .upload(fileName, Buffer.from(base64FileData, 'base64'), {
        contentType: `image/${fileExt}`,
        upsert: true
      })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 })
    }

    const { data: { publicUrl } } = supabase.storage
      .from('public_asset')
      .getPublicUrl(fileName)

    body.cover_image = publicUrl
  }

  // Update profile data
  const { error } = await supabase
    .from('users')
    .update(body)
    .eq('id', session.user.id)

  if (error) {
    console.log(error)
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ message: 'Profile updated successfully' })
}
