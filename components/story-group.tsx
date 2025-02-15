"use client";

import { useState } from "react";
import { StoryCircle } from "./story-circle";
import { StoryViewer } from "./story-viewer";
import getRandomImage from "@/lib/randomImage";

interface Story {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  isVideo?: boolean;
  likes: number;
}

interface StoryGroupProps {
  userId: string;
  ownerAvatar: string;
  ownerName: string;
  stories: Story[];
}

export function StoryGroup(
  { userId, ownerAvatar, ownerName, stories }: StoryGroupProps,
) {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

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
      console.log(currentStoryIndex)
    } else {
      closeViewer();
    }
  };

  const previousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };
  console.log(currentStoryIndex, stories.length)

  return (
    <>
      <StoryCircle
        id={stories[0].id}
        url={stories[0].url}
        thumbnail={stories[0].thumbnail || getRandomImage()}
        title={ownerName}
        isVideo={stories[0].isVideo}
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
          isVideo={stories[currentStoryIndex].isVideo}
          onClose={closeViewer}
          userId={userId} likes={stories[currentStoryIndex].likes}
          ownerAvatar={ownerAvatar}
          ownerName={ownerName}
          onNext={nextStory}
          onPrevious={previousStory}
          totalStories={stories.length}
          currentIndex={currentStoryIndex}
        />
      )}
    </>
  );
}
