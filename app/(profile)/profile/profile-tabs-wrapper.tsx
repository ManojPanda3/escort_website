// app/profile/profile-tabs-wrapper.tsx (Minor change - no initial props)
"use client";

import { ProfileTabs } from "./profile-tabs";
import { useUserData } from "@/lib/useUserData";
import { useEffect } from "react";

interface ProfileTabsWrapperProps {
  userId: string;
}

export function ProfileTabsWrapper({ userId }: ProfileTabsWrapperProps) {
  const {
    pictures,
    services,
    rates,
    testimonials,
    stories,
    isLoading,
    error,
    refetch,
  } = useUserData();

  if (isLoading) {
    return <div>Loading...</div>; // Or your LoadingSpinner
  }

  if (error) {
    return <div>Error: {error}</div>; // Or a more styled error message
  }

  // Now, we *always* use the data from useUserData.
  return (
    <ProfileTabs
      pictures={pictures}
      services={services}
      rates={rates}
      testimonials={testimonials}
      userId={userId}
      refetch={refetch}
    />
  );
}

