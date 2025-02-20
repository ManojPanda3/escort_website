// app/api/auth/signup/start/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    if (!supabaseAdmin) {
      throw new Error("Admin supabase not found");
    }
    const { data: signup_uuid, error: singup_uuid_error } = await supabaseAdmin
      .from("singup_uuid")
      .insert([{}])
      .select()
      .single(); // it will create an default entery with a generated id and created_at

    if (singup_uuid_error) {
      console.error("Supabase user insert error:", userInsertError);
      return NextResponse.json({ message: userInsertError.message }, {
        status: 400,
      });
    }

    return NextResponse.json({
      message:
        "Signup started successful! Please procide with further singup process",
      singup_uuid: signup_uuid.id,
    });
  } catch (error: any) {
    console.error("Signup API error:", error);
    const message = error?.message || "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
