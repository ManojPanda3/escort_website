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
    const { to, comment } = json;

    // Basic validation
    if (!to || !comment) {
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
