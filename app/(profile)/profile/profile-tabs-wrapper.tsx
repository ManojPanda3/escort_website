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
    user,
    pictures,
    rates,
    testimonials,
    stories,
    isLoading,
    error,
    refetch,
  } = useUserData();
  const services = user?.services;


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

