import { notFound } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getRandomImage from "@/lib/randomImage";
import StoryWrapper from "./story-wrapper";

export default async function SharedStoryPage(
  props: { params: Promise<{ id: string }> },
) {
  const supabase = createServerComponentClient({ cookies });
  const params = await props.params;

  const { data: story } = await supabase
    .from("story")
    .select("id, isvideo, owner:users(username,name,profile_picture), title, url, thumbnail, likes")
    .eq("id", params.id)
    .single();
  if (!story) {
    notFound();
  }
  const { data: { user } } = await supabase.auth.getUser();
  const owner = story.owner;
  if (!owner) notFound();
  let isLiked: boolean = false;
  if (user) {
    const { data: story_liked } = await supabase
      .from("story_likes")
      .select("id")
      .eq("post", story.id)
      .eq("user", user?.id)
      .single();
    isLiked = !!story_liked;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <StoryWrapper
        story={story}
        isLiked={isLiked}
      />
    </div>
  );
}
export const runtime = "edge"
