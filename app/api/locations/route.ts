import checkAdmin from '@/lib/checkAdmin';
import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(requests: NextRequest) {
  try {
    if (!supabaseAdmin) throw new Error("failed to initiate the admin")
    const { data, error } =
      supabaseAdmin
        .from('locations')
        .select('*')
    if (error) throw error
    return NextResponse.json({
      error: null,
      message: "success",
      data
    },
      { status: 200 })
  }
  catch (error: any) {
    return NextResponse.json({
      error: error.message,
      message: "failed"
    }, { status: 500 })
  }
}
export async function POST(requests: NextRequest) {
  try {
    if (!await checkAdmin()) return NextResponse.json({
      message: "Unautorized access",
      error: "Unautorized access"
    }, { status: 401 });
    if (!supabaseAdmin) throw new Error("failed to start supabase as admin")
    const newLocation = await requests.json()

    const { data, error } = await supabaseAdmin
      .from('locations')
      .insert(newLocation)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({
      data,
      error: null,
      message: "success"
    }, { status: 200 })

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      message: "failed"
    }, { status: 500 })
  }
}
export async function PUT(requests: NextRequest) {
  try {
    if (!await checkAdmin()) return NextResponse.json({
      message: "Unautorized access",
      error: "Unautorized access"
    }, { status: 401 });
    if (!supabaseAdmin) throw new Error("failed to start supabase as admin")
    const editingLocation = await requests.json()

    const { error } = await supabaseAdmin
      .from('locations')
      .update({ name: editingLocation.name })
      .eq('id', editingLocation.id)

    if (error) throw error

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      message: "failed"
    }, { status: 500 })
  }
}
export async function DELETE(requests: NextRequest) {
  try {
    if (!await checkAdmin()) return NextResponse.json({
      message: "Unautorized access",
      error: "Unautorized access"
    }, { status: 401 });
    if (!supabaseAdmin) throw new Error("failed to start supabase as admin")
    const deleteLocation = await requests.json()

    const { error } = await supabaseAdmin
      .from('locations')
      .delete()
      .eq('id', deleteLocation.id)

    if (error) throw error
    return NextResponse.json({
      error: null,
      message: "success"
    }, { status: 200 })

  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      message: "failed"
    }, { status: 500 })
  }
}
