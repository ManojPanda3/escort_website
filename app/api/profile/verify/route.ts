import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies: cookies });
    const { data: { user } } = await supabase.auth.getUser();
    if (user == null || user.email != process.env.ADMIN_EMAIL) {
      throw new Error("Your not admin");
    }
    const userData = await req.json();
    if (!userData?.id) {
      return NextResponse.json({
        message: "UserId required to verify",
      }, {
        status: 405,
      });
    }
    if (!supabaseAdmin) throw new Error("Unable to start supabase admin");
    supabaseAdmin?.from("users")
      .update({
        is_verified: true,
      })
      .eq("id", userData?.id);
    return NextResponse.json({
      message: "Account verified successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      message: "Unable to verify user,\nfollowing error occure:" +
        error.message,
    }, {
      status: 500,
    });
  }
}

