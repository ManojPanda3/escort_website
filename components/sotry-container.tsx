"use client";

import getRandomImage from "@/lib/randomImage";
import { StoryGroup } from "./story-group";

interface Story {
  id: string;
  url: string;
  thumbnail: string;
  title: string;
  isVideo?: boolean;
  likes: number;
  owner: string;
}

interface User {
  id: string;
  // avatar: string;
  // name: string;
  stories: Story[];
}
interface StoriesContainerProps {
  users: User[];
  currentUserId: string;
}

export function StoriesContainer(
  { users, currentUserId }: StoriesContainerProps,
) {
  return (
    <div className="flex space-x-4 p-4 overflow-x-auto">
      {users.map((user) => (
        <StoryGroup
          key={user.id}
          userId={currentUserId}
          ownerAvatar={user.profile_picture || getRandomImage()}
          ownerName={user.name || user.username}
          stories={user.stories}
        />
      ))}
    </div>
  );
}
