import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      throw new Error("Admin supabase not found")
    }
    const { age_proofs, username, email, userId }: {
      age_proofs: string[],
      username: string,
      email: string,
      userId: string
    } = await request.json()

    const { data: { id } } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (!id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    if (age_proofs.length < 2 || !username || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: existingRecord } = await supabaseAdmin
      .from('age_proof')
      .select()
      .eq('owner', id)
      .single()

    if (existingRecord) {
      return NextResponse.json({ message: "You have already uploaded your age proof" }, {
        status: 500
      })
    }
    const { error } = await supabaseAdmin
      .from('age_proof')
      .insert({
        owner: id,
        age_proofs,
        isverified: false,
        username,
        email,
      })

    if (error) throw error

    return NextResponse.json(
      { message: 'Age proof uploaded successfully',success:true,status:200 },
      { status: 200 }
    )

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  //TODO: make this api for admin only 

  if (true) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const { data, error } = await supabase
      .from('age_proofs')
      .select('*')
      .eq('owner', session.user.id)
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 200 })

  } catch (error: any) {
    return NextResponse.json(
      { errous: 500 }
    )
  }
}
export const runtime = "edge"
