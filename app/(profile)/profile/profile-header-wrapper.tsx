// --- app/profile/profile-header-wrapper.tsx ---
"use client";

import { ProfileHeader } from "./profile-header";
import { useUserData } from "@/lib/useUserData";
import { LoadingSpinner } from "@/components/ui/loading";


export function ProfileHeaderWrapper() {
  const { user, isLoading, error, bookmarks } = useUserData(); // Get bookmarks from useUserData

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-20">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !user) {
    return <div className="text-red-500">Error loading profile.</div>;
  }

  return <ProfileHeader profile={user} bookmarks={bookmarks} />; // Pass bookmarks to ProfileHeader
}

