"use client"
import { useUserData } from "@/lib/useUserData";
import { StoryUploadButton } from "./story-upload-button";
import { StoriesContainer } from "@/components/story-container";

const StoryWrapper = () => {
  const { user, stories } = useUserData();
  if (!user?.id || user?.user_type === "general") return null;
  const users = [{ ...user, stories }];
  return (
    <div className="mb-6 flex items-center">
      <StoryUploadButton />
      <StoriesContainer
        users={users}
      />
    </div>
  )
}

export default StoryWrapper;
