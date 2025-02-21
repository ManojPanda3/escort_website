import { EscortCard } from "@/components/escort-card";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import HeroCard from "@/components/HeroCard.tsx";
import { MouseGlow } from "@/components/mouse-glow";
import { RoyalBackground } from "@/components/royal-background";
import { ScrollToTop } from "@/components/scroll_to_top";
import { Suspense } from "react";
import { CategoryTabs } from "@/components/category-tabs";
import { FeaturedEscorts } from "@/components/featured-escorts";
import { AboutSection } from "@/components/about-section";
import { StoriesContainer } from "@/components/story-container";
import getRandomImage from "@/lib/randomImage";
import Users from "@/components/Users.tsx";
import { Database } from "@/lib/database.types";
import FaqAllNighters from "@/components/Faq02";

type Escort = Database["public"]["Tables"]["users"]["Row"];
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

export default async function EscortsPage(
  { searchParams }: { searchParams: { location?: string; gender?: string } },
) {
  const supabase = createServerComponentClient({ cookies });
  const search_params = await searchParams;
  const location = search_params?.location;
  const gender = search_params?.gender;

  let query = supabase.from("users").select("*").eq("user_type", "escort");
  if (
    location &&
    location.trim() !== "" &&
    location.toLocaleLowerCase() !== "all locations"
  ) {
    query = query.or(
      `service_provided.contains(.${JSON.stringify([location])}),location.eq(.${location})`);
  }
  if (
    gender && gender.trim() !== "" && gender.toLocaleLowerCase() !== "viewall"
  ) {
    query = query.eq("gender", gender);
  }

  const { data: escorts, error }: {
    data: Escort[];
    error: unknown;
  } = await query;

  if (error) {
    console.error("Error fetching escorts:", error);
    return <div>Error loading escorts. Please try again later.</div>;
  }

  const stories = await fetchStories(
    supabase,
    escorts.map(({ id }) => {
      return id;
    }),
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background/80 to-background dark:from-black dark:via-gray-900 dark:to-black">
      {/* Mouse Glow Effect */}
      <MouseGlow />
      <RoyalBackground />
      <div className="relative z-10">
        <main>
          {/* Hero Section */}
          <Suspense
            fallback={<div className="animate-pulse h-96 bg-gray-200" />}
          >
            <HeroCard
              label={`Escorts ${location ? "in " + location : ""}`}
              initial_location={location || ""}
              initial_gender={gender || ""}
            />
          </Suspense>

          {/* Featured Escorts Section */}
          <section className="container mx-auto px-4 py-8">
            <FeaturedEscorts users={escorts.slice(0, 4)} />
          </section>

          {/* Stories Section */}
          <section className="container mx-auto px-4 py-8">
            <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
              Latest Stories
            </h2>
            <StoriesContainer
              users={escorts.map((escort) => ({
                ...escort,
                stories: stories?.filter((story) => story.owner === escort.id),
              }))
              }
            />
          </section>
          <Users
            users={escorts}
          />
          <FaqAllNighters />

          {/* About Section */}
          <section className="container mx-auto px-4 py-8">
            <AboutSection />
          </section>

          {/* Scroll to Top Button */}
          <ScrollToTop />
        </main>
      </div>
    </div>
  );
}
