import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation"; // Import notFound
import { ProfileHeader } from "./othersprofile-header";
import { ProfileTabs } from "./othersprofile-tabs";
import { StoriesContainer } from "@/components/story-container";

async function fetchStories(supabase, userId: string) {
  const { data, error } = await supabase
    .from("story")
    .select("id, isvideo, owner, title, url, thumbnail, likes")
    .eq("owner", userId);

  if (error) {
    console.error("Error fetching stories:", error);
    throw error;
  }

  return data;
}
// Create cached version of data fetching
//
const getProfileData = async (supabase: any, id: string) => {
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
    fetchStories(supabase, id),
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
    // Important: If no profile is found, use notFound()
    notFound();
    return; // TS needs this
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
  const supabase = createServerComponentClient({ cookies });
  const { data: { user: authUser }, error: authError } = await supabase.auth
    .getUser();

  if (authError) {
    console.error("Authentication error:", authError);
    redirect("/auth/login"); // Redirect to login if not authenticated
    return null; // TypeScript needs this
  }

  const currentUser = authUser
    ? (await supabase.from("users").select("id,profile_picture,username").eq(
      "id",
      authUser.id,
    ).single()).data
    : null;

  const userData = await getProfileData(supabase, id);

  // Check if user is "general" *after* fetching the data
  const isGeneralUser = userData.profile.user_type === "general";
  const stories = userData.stories;

  return (
    <main className="container mx-auto px-4 py-8">
      <ProfileHeader profile={userData.profile} />
      <section
        aria-label="User Stories"
        className="mb-8 overflow-x-auto"
      >
        <div className="flex gap-4 pb-2">
          {stories.length > 0
            ? (
              <StoriesContainer
                users={userData.profile.map((user) => ({ ...user, stories }))}
                currentUserId={currentUser?.id}
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
          pictures={userData.pictures}
          rates={userData.rates}
          testimonials={userData.testimonials}
          user={userData.profile}
          currentUser={currentUser}
        />
      )}
    </main>
  );
}
