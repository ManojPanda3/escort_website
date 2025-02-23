import { notFound, redirect } from "next/navigation"; // Import notFound
import { ProfileHeader } from "./othersprofile-header";
import { ProfileTabs } from "./othersprofile-tabs";
import { StoriesContainer } from "@/components/story-container";
import { supabase } from "@/lib/supabase";

async function fetchStories(userId: string) {
  const fetchData = await supabase
    .from("story")
    .select("id, isvideo, owner, title, url, thumbnail, likes")
    .eq("owner", userId);

  return fetchData;
}
// Create cached version of data fetching
//
const getProfileData = async (id: string) => {
  const [
    { data: profile, error: profileError },
    { data: pictures, error: picturesError },
    { data: rates, error: ratesError },
    { data: testimonials, error: testimonialsError },
    { data: stories, error: storiesError },
  ] = await Promise.all([
    supabase
      .from("users")
      .select("*") // Select all columns, including user_type
      .eq("id", id)
      .single(),
    supabase
      .from("pictures")
      .select("*")
      .eq("owner", id)
      .order("created_at", { ascending: false }),
    supabase
      .from("rates")
      .select("*")
      .eq("owner", id),
    supabase
      .from("testimonials")
      .select(` *,
        owner:users(
        id,
        username,
        profile_picture
        )
        `)
      .eq("to", id),
    fetchStories(id),
  ]);
  const errors = [
    profileError,
    picturesError,
    ratesError,
    testimonialsError,
    storiesError,
  ];
  if (errors.some((error) => error !== null)) {
    const errorMessage = errors.map((error) => {
      if (error) {
        return error?.message;
      }
    }).join(", ");
    console.error("Failed to fetch profile data\nerrors are:\t" + errorMessage);
  }
  if (profile == null) {
    notFound();
    return;
  }

  return {
    profile,
    pictures: pictures || [],
    rates: rates || [],
    testimonials: testimonials || [],
    stories: stories || [],
  };
};

export default async function UserProfilePage(
  props: {
    params: Promise<{ id: string }>;
  },
) {
  const params = await props.params;
  const id = params.id;
  const userData = await getProfileData(id);

  const isGeneralUser = userData?.profile.user_type === "general";
  const stories = userData?.stories;

  return (
    <main className="container mx-auto px-4 py-8">
      <ProfileHeader profile={userData?.profile} />
      <section
        aria-label="User Stories"
        className="mb-8 overflow-x-auto"
      >
        <div className="flex gap-4 pb-2">
          {stories && stories.length > 0
            ? (
              <StoriesContainer
                users={userData?.profile.map((user) => ({ ...user, stories }))}
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
      {!isGeneralUser && (
        <ProfileTabs
          pictures={userData?.pictures}
          rates={userData?.rates}
          testimonials={userData?.testimonials}
          user={userData?.profile}
        />
      )}
    </main>
  );
}
