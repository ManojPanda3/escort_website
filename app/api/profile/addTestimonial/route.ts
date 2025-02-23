// app/api/profile/addTestimonials/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database.types";
type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const { to, comment, rating } = json;

    // Basic validation
    if (!to || !comment || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, {
        status: 400,
      });
    }

    const { data, error } = await supabase
      .from("testimonials")
      .insert({
        owner: session.user.id,
        to,
        comment,
        rating
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, testimonial: data }); // Return created testimonial
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const { id, comment, rating } = json;

    // Basic validation
    if (!id || !comment || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, {
        status: 400,
      });
    }

    const { data, error } = await supabase
      .from("testimonials")
      .update({
        comment,
        rating
      })
      .eq("owner", session.user.id)
      .eq("id", id)
      .select()
      .single();
    ;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, testimonial: data }); // Return created testimonial
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await request.json();
    const { id } = json;

    // Basic validation
    if (!id) {
      return NextResponse.json({ error: "Missing required fields" }, {
        status: 400,
      });
    }

    const { data, error } = await supabase
      .from("testimonials")
      .delete()
      .eq("id", id)
      .eq("owner", session.user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, testimonial: data }); // Return created testimonial
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
