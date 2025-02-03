import { NavBar } from "@/components/nav-bar";
import { Hero } from "@/components/hero";
import { FeaturedEscorts } from "@/components/featured-escorts";
import { CategoryTabs } from "@/components/category-tabs";
import { EscortCard } from "@/components/escort-card";
import { StoryCircle } from "@/components/story-circle";
import { Footer } from "@/components/footer";
import { MouseGlow } from "@/components/mouse-glow";
import FaqAllNighters from "@/components/Faq02";
import { AboutSection } from "@/components/about-section"; // <-- new AboutSection
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Link from "next/link";
import { Metadata } from "next";
import { Suspense } from "react";

// Add metadata for SEO
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
async function fetchUsers() {
  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from("users")
    .select(
      "id, username, age, location_name, dress_size, profile_picture, is_verified",
    )
    .neq("user_type", "general")
    .order("ratings", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    throw error;
  }

  console.log("Fetched Users:", data);
  return data;
}

// Function to fetch stories
async function fetchStories(userIds: string[]) {
  if (!userIds.length) {
    console.warn("No user IDs provided for fetching stories.");
    return [];
  }

  console.log("Fetching stories for user IDs:", userIds);

  const supabase = createServerComponentClient({ cookies });
  const { data, error } = await supabase
    .from("story")
    .select("id, isvideo, owner, title, url")
    .in("owner", userIds);

  if (error) {
    console.error("Error fetching stories:", error);
    throw error;
  }

  console.log("Fetched Stories:", data);
  return data;
}

// Random image generator (0 to 17)
function getRandomImage() {
  const imageIndex = Math.floor(Math.random() * 18); // Random number between 0 and 17
  return `http://raw.githubusercontent.com/riivana/All-nighter-random-images/refs/heads/main/image%20${imageIndex}.webp`;
}

export default async function Page() {
  let users = [];
  let stories = [];

  try {
    users = await fetchUsers();
    if (!users.length) {
      return <div role="alert" className="p-4">No users found.</div>;
    }

    stories = await fetchStories(users.map((user) => user.id));
  } catch (error) {
    console.error("Error fetching data:", error);
    return (
      <div role="alert" className="p-4 text-red-500">
        Failed to load data. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-background dark:from-black dark:via-gray-900 dark:to-black">
      <Suspense fallback={<div className="animate-pulse h-16 bg-gray-200" />}>
        <MouseGlow />
        <NavBar />
      </Suspense>

      <main>
        <h1 className="sr-only">Premium Escort Directory</h1>
        <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200" />}>
          <Hero />
        </Suspense>

        <Suspense fallback={<div className="animate-pulse h-64 bg-gray-200" />}>
          <FeaturedEscorts users={users.slice(0, 3)} />
        </Suspense>

        <div className="container mx-auto px-4 py-6 text-foreground">
          {/* Stories Section */}
          <Suspense
            fallback={<div className="animate-pulse h-24 bg-gray-200 mb-8" />}
          >
            <section aria-label="User Stories" className="mb-8 overflow-x-auto">
              <div className="flex gap-4 pb-2">
                {console.log(
                  "Rendering Stories Section. Stories Length:",
                  stories.length,
                )}
                {stories.length > 0
                  ? (
                    stories.map((story, index) => (
                      <StoryCircle
                        key={story.id || index}
                        {...story}
                        isVideo={story.isvideo}
                        isActive={index === 0}
                      />
                    ))
                  )
                  : (
                    <div className="relative w-full h-56">
                      <img
                        src={getRandomImage() || "/placeholder.svg"}
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

          <Suspense
            fallback={<div className="animate-pulse h-16 bg-gray-200 mb-8" />}
          >
            <section aria-label="Categories" className="mb-8">
              <CategoryTabs />
            </section>
          </Suspense>

          <section aria-label="Escort Listings">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {users.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.id}`}
                  className="focus:outline-none focus:ring-2 focus:ring-primary rounded-lg"
                  aria-label={`View ${user.username}'s profile`}
                  prefetch={false}
                >
                  <EscortCard
                    name={user.username}
                    age={user.age}
                    location={user.location_name}
                    measurements={user.dress_size}
                    image={user.profile_picture || "/placeholder.svg"}
                    isVerified={user.is_verified}
                    isVip={user.current_offer != null}
                  />
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* About Section */}
        <AboutSection />
      </main>
      <FaqAllNighters />

      <Footer />
    </div>
  );
}
