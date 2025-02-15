import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ data: null, error: "Unauthorized" }, {
        status: 401,
      });
    }

    const json = await request.json();
    const { to, comment, profile_picture, name } = json;

    const { error } = await supabase
      .from("testimonials")
      .insert({
        owner: session.user.id,
        to,
        comment,
        profile_picture,
        name,
      });

    if (error) {
      return NextResponse.json({ data: null, error: error.message }, {
        status: 400,
      });
    }

    return NextResponse.json({
      data: {
        owner: session.user.id,
        to,
        comment,
        profile_picture,
        name,
      },
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json({
      data: null,
      success: false,
      message: error.message,
    }, {
      status: 500,
    });
  }
}
