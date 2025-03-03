"use client"
import { StoryViewer } from "@/components/story-viewer";
import getRandomImage from "@/lib/randomImage";
import { supabase } from "@/lib/supabase";
import { useUserData } from "@/lib/useUserData";
import { useState } from "react";

export default function StoryWrapper({ story, isLiked }) {
  const [liked, setLiked] = useState<boolean>(isLiked);
  const [likes, setLikes] = useState<number>(story?.likes);
  const { user } = useUserData();
  const userId = user?.id;
  async function handleLike() {
    if (!liked) {
      await Promise.all([supabase.from("story_likes").insert([{ post: id, user: userId }]),
      supabase.from("story").update({
        likes: likes + 1
      }).eq("id", story?.id)]);
    } else {
      await Promise.all([supabase.from("story_likes").delete().eq("post", story?.id).eq(
        "user",
        userId,
      ),
      supabase.from("story").update({
        likes: likes + 1
      }).eq("id", story?.id)]);
    }
    setLiked(!liked);
  }
  return (
    <StoryViewer
      id={story?.id}
      url={story?.url || getRandomImage()}
      title={story?.title}
      isVideo={story?.isvideo}
      userId={user?.id}
      likes={story?.likes}
      liked={liked}
      ownerAvatar={story?.owner?.profile_picture || getRandomImage()}
      ownerName={story?.owner.name || story?.owner.username}
      currentIndex={0}
      handleLike={handleLike}
    />
  );
}
