// app/api/profile/addImage/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database.types";

type Picture = Database["public"]["Tables"]["pictures"]["Row"];
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const pictureUrl = formData.get("picture") as string;
  const title = formData.get("title") as string;
  const isMain = formData.get("isMain") === "true";

  if (!pictureUrl || !title) {
    return NextResponse.json({ error: "url and title are required" }, {
      status: 400,
    });
  }

  const { data, error: dbError } = await supabase
    .from("pictures")
    .insert({
      owner: session.user.id,
      picture: pictureUrl,
      title,
      "is main": isMain,
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: "Image added successfully",
    picture: data,
  }); // Return the whole picture
}

export async function DELETE(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await request.json();
  if (!id) {
    return NextResponse.json({ error: "Id is required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("pictures")
    .delete()
    .eq("id", id)
    .eq("owner", session.user.id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, id }); // Return the deleted ID
}

