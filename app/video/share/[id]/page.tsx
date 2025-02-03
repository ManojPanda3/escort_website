import { notFound } from "next/navigation";
import { StoryViewer } from "@/components/story-viewer";
import { supabase } from "@/lib/supabase";

export default async function SharedStoryPage(
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;

  const { data: story } = await supabase
    .from("story")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!story) {
    notFound();
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <StoryViewer
        id={story.id}
        url={story.url}
        title={story.title}
        isVideo={story.isvideo}
        isMain={true}
      />
    </div>
  );
}
