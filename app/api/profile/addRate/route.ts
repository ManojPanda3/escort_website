// app/api/profile/addRate/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database.types";

type Rate = Database["public"]["Tables"]["rates"]["Row"];

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { reason, price, duration, outcall } = await request.json();

  // Basic validation (use Zod for production)
  if (!reason || !price || !duration) {
    return NextResponse.json({ error: "Missing required fields" }, {
      status: 400,
    });
  }

  const { data, error } = await supabase
    .from("rates")
    .insert({
      owner: session.user.id,
      reason,
      price,
      duration,
      outcall,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, rate: data }); // Return the created rate
}

export async function DELETE(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }
  const { error } = await supabase
    .from("rates")
    .delete()
    .eq("id", id)
    .eq("owner", session.user.id); // Ensure user owns the rate

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, id }); // Return the deleted ID
}

export const runtime = "edge"
