import { notFound } from "next/navigation";
import { StoryViewer } from "@/components/story-viewer";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getRandomImage from "@/lib/randomImage";

export default async function SharedStoryPage(
  props: { params: Promise<{ id: string }> },
) {
  const supabase = createServerComponentClient({ cookies });
  const params = await props.params;

  const { data: story } = await supabase
    .from("story")
    .select("id, isvideo, owner, title, url, thumbnail, likes")
    .eq("id", params.id)
    .single();
  if (!story) {
    notFound();
  }
  const { data: owner } = await supabase.from("users")
    .select("username,name,profile_picture")
    .eq("id", story.owner)
    .single();
  const { data: { user } } = await supabase.auth.getUser();
  if (!owner) notFound();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <StoryViewer
        id={story?.id}
        url={story?.url || getRandomImage()}
        title={story?.title}
        isVideo={story?.isvideo}
        userId={user?.id}
        likes={story?.likes}
        ownerAvatar={owner?.profile_picture || getRandomImage()}
        ownerName={owner.name || owner.username}
      />
    </div>
  );
}
