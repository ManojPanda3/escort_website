// lib/useUserData.ts
"use client";
import { useCallback, useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "./database.types";

type User = Database["public"]["Tables"]["users"]["Row"];
type Picture = Database["public"]["Tables"]["pictures"]["Row"];
type Rate = Database["public"]["Tables"]["rates"]["Row"];
type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"] & {
  owner: Pick<User, "id" | "username" | "profile_picture">;
};
type Story = Database["public"]["Tables"]["story"]["Row"];
type Bookmark = Database["public"]["Tables"]["bookmarks"]["Row"];

interface UserData {
  user: User | null;
  pictures: Picture[];
  rates: Rate[];
  testimonials: Testimonial[];
  stories: Story[];
  bookmarks: Bookmark[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  clearCache: () => void;
}

const CACHE_KEY = "userData";
const CACHE_EXPIRY = 30 * 60 * 1000; // 30min

export function useUserData(): UserData {
  const supabase = createClientComponentClient<Database>(); // Move Supabase client initialization here

  const [userData, setUserData] = useState<UserData>({
    user: null,
    pictures: [],
    rates: [],
    testimonials: [],
    stories: [],
    bookmarks: [],
    isLoading: true,
    error: null,
    refetch: async () => { }, // Initialize with empty functions
    clearCache: () => { },
  });

  // Define clearCache outside of fetchData, so it's always available.
  const clearCache = useCallback(() => {
    localStorage.removeItem(CACHE_KEY);
  }, []);

  const fetchData = useCallback(async () => {
    setUserData((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        return;
      }

      const [
        { data: profile, error: profileError },
        { data: pictures, error: picturesError },
        { data: rates, error: ratesError },
        { data: testimonials, error: testimonialsError },
        { data: stories, error: storyError },
        { data: bookmarks, error: bookmarksError },
      ] = await Promise.all([
        supabase.from("users").select("*").eq("id", user.id).single(),
        supabase.from("pictures").select("*").eq("owner", user.id).order(
          "created_at",
          { ascending: false },
        ),
        supabase.from("rates").select("*").eq("owner", user.id),
        supabase.from("testimonials").select(
          "*, owner:users (id, username, profile_picture)",
        ).eq("to", user.id),
        supabase.from("story").select("*").eq("owner", user.id).order(
          "created_at",
          { ascending: false },
        ),
        supabase.from("bookmarks").select("*").eq("owner", user.id),
      ]);

      const errors = [
        profileError,
        picturesError,
        ratesError,
        testimonialsError,
        storyError,
        bookmarksError,
      ];
      const errorMessage = errors.filter(Boolean).map((e) => e?.message).join(
        ", ",
      );
      if (errorMessage) {
        throw new Error(errorMessage);
      }
      if (!profile) throw new Error("Profile Not Found");

      const fetchedUserData = {
        user: profile as User,
        pictures: pictures || [],
        rates: rates || [],
        testimonials: (testimonials as Testimonial[]) || [],
        stories: stories || [],
        bookmarks: bookmarks || [],
      };

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data: fetchedUserData,
          expiresAt: Date.now() + CACHE_EXPIRY,
        }),
      );

      setUserData({
        ...fetchedUserData,
        isLoading: false,
        error: null,
        refetch: fetchData,
        clearCache, // Use the defined clearCache function
      });
    } catch (error: any) {
      setUserData((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
        refetch: fetchData,
        clearCache, // Use the defined clearCache function
      }));
      console.error("Error fetching user data:", error); // Log the error for debugging
    }
  }, [supabase, clearCache]); // Include clearCache in dependency array

  useEffect(() => {
    const cachedDataString = localStorage.getItem(CACHE_KEY);

    if (cachedDataString) {
      const cachedData = JSON.parse(cachedDataString);
      if (cachedData.expiresAt > Date.now()) {
        setUserData({
          ...cachedData.data,
          isLoading: false,
          error: null,
          refetch: fetchData,
          clearCache, //Use defined ClearCache
        });
        return;
      } else {
        clearCache(); // Clear expired cache
        fetchData()
      }
    } else {
      if (!userData.isLoading) {
        fetchData();
      } else {
        setUserData(n => ({ ...n, refetch: fetchData }))
      }
    }
    setUserData((prev) => ({ ...prev, isLoading: false, error: null }));

  }, [fetchData, clearCache]); // Include clearCache in dependency array

  return userData;
}

