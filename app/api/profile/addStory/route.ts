// app/api/profile/addStory/route.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Database } from "@/lib/database.types";

type Story = Database["public"]["Tables"]["story"]["Row"];
export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File;
  const title = formData.get("title") as string;

  if (!file || !title) {
    return NextResponse.json({ error: "File and title are required" }, {
      status: 400,
    });
  }

  const fileExt = file.name.split(".").pop();
  const fileName = `${session.user.id}/${Date.now()}.${fileExt}`;

  const { error: uploadError, data } = await supabase.storage
    .from("stories")
    .upload(fileName, file);

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 400 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("stories").getPublicUrl(fileName);

  const isVideo = file.type.startsWith("video/");

  //Get the thumbnail if it is video
  let thumbnailUrl = null;
  if (isVideo) {
    const { data: thumbData } = await supabase.storage
      .from("stories")
      .createSignedUrl(fileName, 60); // Create a short-lived URL
    if (thumbData) {
      thumbnailUrl = thumbData.signedUrl;
    }
  }

  const { error: dbError, data: storyData } = await supabase
    .from("story")
    .insert({
      owner: session.user.id,
      url: publicUrl,
      title,
      isVideo,
      thumbnail: thumbnailUrl,
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, story: storyData }); // Return created story
}

