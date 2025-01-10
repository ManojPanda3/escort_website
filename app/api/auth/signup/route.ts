import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string
  const userType = formData.get('userType') as string
  const age = formData.get('age') as string
  const ageProof = formData.get('ageProof') as File | null

  const supabase = createRouteHandlerClient({ cookies })

  let ageProofPath = null

  if (ageProof) {
    const { data, error: uploadError } = await supabase.storage
      .from('age_proofs')
      .upload(`${Date.now()}_${ageProof.name}`, ageProof)

    if (uploadError) {
      return NextResponse.json({ error: 'Failed to upload age proof' }, { status: 500 })
    }

    ageProofPath = data?.path
  }

  // Sign up the user
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        type: userType,
        age: age || null,
        age_proof: ageProofPath,
      }
    }
  })

  if (signUpError) {
    return NextResponse.json({ error: signUpError.message }, { status: 400 })
  }

  // Create profile record
  const { error: profileError } = await supabase
    .from('profiles')
    .insert([
      {
        id: authData.user?.id,
        username,
        email,
        type: userType,
        age: parseInt(age),
        age_proof: ageProofPath,
      }
    ])

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 400 })
  }

  // Set the auth cookie
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionError) {
    return NextResponse.json({ error: sessionError.message }, { status: 400 })
  }

  // Return success with redirect path
  return NextResponse.json({ 
    message: 'Signup successful!',
    redirectTo: '/profile/edit'
  })
}

