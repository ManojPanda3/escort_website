import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  try {
    if (!supabaseAdmin) throw new Error("Admin supabase not found")
    const email = formData.get('email') as string
    const username = formData.get('username') as string
    const userType = formData.get('userType') as string
    const age = formData.get('age') as string
    const location = formData.get('location') as string
    const locationName = formData.get('locationName') as string
    const interest = formData.get('interest') as string
    const gender = formData.get('gender') as string
    const userId = formData.get('userId') as string

    if (!age || parseInt(age) < 18) {
      return NextResponse.json({ message: 'Must be 18 or older to register.' }, { status: 400 })
    }

    const userDataToInsert = {
      id: userId,
      username,
      email,
      user_type: userType,
      age: parseInt(age),
      is_verified: false,
      location,
      interest,
      gender,
      location_name: locationName
    }

    const { data: insertedUser, error: userInsertError } = await supabaseAdmin
      .from('users')
      .insert([userDataToInsert])
      .select()
      .single();

    if (userInsertError) {
      return NextResponse.json({ message: userInsertError.message }, { status: 400 })
    }

    return NextResponse.json({
      message: 'Signup successful! Please check your email for verification.',
      userId: insertedUser.id
    })

  } catch (error: any) {
    const message = error?.message || 'Internal Server Error'
    return NextResponse.json({ message }, { status: 500 })
  }
}
