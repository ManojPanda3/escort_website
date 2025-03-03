"use client";

import getRandomImage from "@/lib/randomImage";
import { StoryGroup } from "./story-group";
import { useUserData } from "@/lib/useUserData";

interface Story {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  isvideo?: boolean;
  likes: number;
  owner: string;
}

interface User {
  id: string;
  profile_picture?: string; // Made profile_picture optional
  name?: string; // Made name optional
  username: string;
  stories: Story[];
}
interface StoriesContainerProps {
  users: User[];
}

export function StoriesContainer(
  { users }: StoriesContainerProps,
) {
  const { user: currentUser } = useUserData();
  const currentUserId = currentUser?.id
  return (
    <div className="flex space-x-4 p-4 overflow-x-auto">
      {users.map((user) => {
        // Check for empty, null, or undefined stories
        if (!user.stories || user.stories.length === 0) {
          return null; // Don't render anything for this user
        }

        return (
          <StoryGroup
            key={user.id}
            userId={currentUserId}
            ownerAvatar={user.profile_picture || getRandomImage()}
            ownerName={user.name || user.username}
            stories={user.stories} // No need to check again here, already handled
          />
        );
      })}
    </div>
  );
}
