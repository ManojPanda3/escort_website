//page
import { Hero } from "@/components/hero";
import { FeaturedEscorts } from "@/components/featured-escorts";
import FaqAllNighters from "@/components/Faq02";
import { AboutSection } from "@/components/about-section";
import { MouseGlow } from "@/components/mouse-glow";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { Metadata } from "next";
import { Suspense } from "react";
import { ScrollToTop } from "@/components/scroll_to_top";
import { RoyalBackground } from "@/components/royal-background";
import { StoriesContainer } from "../components/story-container.tsx";
import UsersCard, { UserWrapper } from "../components/Users.tsx";

export const metadata: Metadata = {
  title: "Find Your Perfect Companion | Premium Escort Directory",
  description:
    "Browse our curated selection of verified companions. View profiles, stories and connect with escorts in your area.",
  openGraph: {
    title: "Find Your Perfect Companion | Premium Escort Directory",
    description:
      "Browse our curated selection of verified companions. View profiles, stories and connect with escorts in your area.",
    type: "website",
  },
};

// Function to fetch users
async function fetchUsers(supabase) {
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, name,username, age, location_name, availability,availability_exp,dress_size, profile_picture, is_verified,current_offer",
    )
    .neq("user_type", "general")
    .order("ratings", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching users:", error);
    throw error;
  }

  return data;
}

// Function to fetch stories
async function fetchStories(supabase, userIds: string[]) {
  const { data, error } = await supabase
    .from("story")
    .select("id, isvideo, owner, title, url, thumbnail, likes")
    .in("owner", userIds);

  if (error) {
    console.error("Error fetching stories:", error);
    throw error;
  }

  return data;
}

export default async function Page() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user: currentUser }, error } = await supabase.auth.getUser();

  let users = [];
  let stories = [];

  try {
    users = await fetchUsers(supabase);
    stories = await fetchStories(supabase, users.map((user) => user.id));
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <div role="alert" className="p-4 text-red-500">
        Failed to load data. Please try again later.
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background/80 to-background dark:from-black dark:via-gray-900 dark:to-black">
      {/* Mouse Glow Effect */}
      <MouseGlow />
      <RoyalBackground />
      <div className="relative z-10">
        <main>
          <h1 className="sr-only">Premium Escort Directory</h1>

          <Suspense
            fallback={<div className="animate-pulse h-96 bg-gray-200" />}
          >
            <Hero />
          </Suspense>

          <Suspense
            fallback={<div className="animate-pulse h-64 bg-gray-200" />}
          >
            <FeaturedEscorts users={users.slice(0, 3)} />
          </Suspense>

          <div className="container mx-auto px-4 py-6 text-foreground">
            <Suspense
              fallback={<div className="animate-pulse h-24 bg-gray-200 mb-8" />}
            >
              <section
                aria-label="User Stories"
                className="mb-8 overflow-x-auto"
              >
                <div className="flex gap-4 pb-2">
                  {stories.length > 0
                    ? (
                      <StoriesContainer
                        users={
                          users.map(
                            (user) => (
                              {
                                ...user,
                                stories: stories?.filter(
                                  ({ owner }) => owner === user.id
                                ),
                              }
                            )
                          )
                        }
                      />
                    )
                    : (
                      <div className="relative w-full h-56">
                        <img
                          src={"/placeholder.svg"}
                          alt="No stories available"
                          loading="lazy"
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-white text-3xl font-bold bg-black/50">
                          All-Nighter
                        </div>
                      </div>
                    )}
                </div>
              </section>
            </Suspense>
            <UserWrapper
              users={users}
            />
          </div>

          <AboutSection />
          <FaqAllNighters />
          <ScrollToTop />
        </main>
      </div>
    </div>
  );
}
export const runtime = "edge"
