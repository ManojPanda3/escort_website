// app/api/profile/updateUser/route.ts (COMBINED UPDATE AND SERVICES)
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database.types";

export async function PATCH(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  // Basic input validation (use a library like Zod in production)
  if (body.services && !Array.isArray(body.services)) {
    return new NextResponse("Invalid services data", { status: 400 });
  }
  if (body.services) {
    // Check if every element in body.services is a string
    if (!body.services.every((service: any) => typeof service === "string")) {
      return new NextResponse(
        "Invalid services data: services must be an array of strings",
        { status: 400 },
      );
    }
  }

  //Remove any restricted fields that should not be updatable directly
  delete body.id; //Prevent updating the ID
  delete body.email; //Prevent email updates via this endpoint (use auth methods)
  delete body.created_at;
  delete body.ratings;

  const { error } = await supabase
    .from("users")
    .update(body)
    .eq("id", session.user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
