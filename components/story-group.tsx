"use client";

import { useEffect, useState } from "react";
import { StoryCircle } from "./story-circle";
import { StoryViewer } from "./story-viewer";
import getRandomImage from "@/lib/randomImage";
import { supabase } from "@/lib/supabase";

interface Story {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  isvideo?: boolean; likes: number;
}

interface StoryGroupProps {
  userId: string | null | undefined;
  ownerAvatar: string;
  ownerName: string;
  stories: Story[];
}

export function StoryGroup(
  { userId, ownerAvatar, ownerName, stories }: StoryGroupProps,
) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isLikedStories, setStoriesLiked] = useState<boolean[]>(stories.map(() => false))
  const [likeCounts, setLikeCounts] = useState(stories.map(n => n.likes));

  useEffect(() => {
    if (!userId) return;
    const postId = stories.map(({ id }) => id)
    supabase
      .from("story_likes")
      .select("post")
      .eq("user", userId)
      .in("post", postId)
      .then(({ data, error }) => {
        if (error) {
          console.error("Error while reading story_likes")
        } else {
          setStoriesLiked((n) => {
            const newState = [...n];
            for (let i = 0; i < stories.length; i++) {
              const isLiked = !!data.find(n => n.post === stories[i].id);
              newState[i] = isLiked;
            }
            return newState;
          })
        }
      })
  }, [stories, userId]);

  const handleLike = async () => {
    if (!userId) return;
    const newLikedState = !isLikedStories[currentStoryIndex];
    setStoriesLiked(n => {
      const newState = [...n];
      newState[currentStoryIndex] = newLikedState;
      return newState;
    });
    const id = stories[currentStoryIndex].id;
    if (newLikedState) {
      await supabase.from("story_likes").insert([{ post: id, user: userId }]);
    } else {
      await supabase.from("story_likes").delete().eq("post", id).eq(
        "user",
        userId,
      );
    }
    const prev = likeCounts[currentStoryIndex]
    const supabaseResponse = await supabase.from("story").update({
      likes: newLikedState ? prev + 1 : prev - 1
    }).eq("id", id);
    setLikeCounts((n) => {
      const newState = [...n]
      newState[currentStoryIndex] = newLikedState ? prev + 1 : prev - 1
      return newState;
    });

  };

  const openViewer = () => {
    setCurrentStoryIndex(0);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
  };

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      closeViewer();
    }
  };

  const previousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  return (
    <>
      <StoryCircle
        id={stories[0].id}
        url={stories[0].url}
        thumbnail={stories[0].thumbnail || getRandomImage()}
        title={ownerName}
        isVideo={stories[0].isvideo}
        userId={userId}
        likes={stories[0].likes}
        ownerAvatar={ownerAvatar}
        ownerName={ownerName}
        onClick={openViewer}
      />
      {isViewerOpen && (
        <StoryViewer
          id={stories[currentStoryIndex].id}
          url={stories[currentStoryIndex].url}
          title={stories[currentStoryIndex].title}
          isVideo={stories[currentStoryIndex].isvideo}
          onClose={closeViewer}
          userId={userId}
          likes={likeCounts[currentStoryIndex]}
          liked={isLikedStories[currentStoryIndex]}
          ownerAvatar={ownerAvatar}
          ownerName={ownerName}
          onNext={nextStory}
          onPrevious={previousStory}
          totalStories={stories.length}
          currentIndex={currentStoryIndex}
          handleLike={handleLike}
        />
      )}
    </>
  );
}
