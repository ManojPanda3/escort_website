import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ProfileHeader } from "./othersprofile-header";
import { ProfileTabs } from "./othersprofile-tabs";

// Create cached version of data fetching
const getProfileData = async (supabase: any, id: string) => {
  const [
    { data: profile, error: profileError },
    { data: pictures, error: picturesError },
    { data: rates, error: ratesError },
    { data: testimonials, error: testimonialsError },
  ] = await Promise.all([
    supabase
      .from("users")
      .select("*")
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
  ]);
  const errors = [
    profileError,
    picturesError,
    ratesError,
    testimonialsError,
  ];
  if (errors.some((error) => error !== null)) {
    const errorMessage = errors.map((error) => {
      if (error) {
        return error?.message;
      }
    }).join(", ");
    console.error("Failed to fetch profile data\nerrors are:\t" + errorMessage);
  }
  if (profile == null) return;

  return {
    profile,
    pictures: pictures || [],
    rates: rates || [],
    testimonials: testimonials || [],
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
  const user = await (async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw Error(JSON.stringify(error));
      const { data: currentUser, error: currentUserError } = await supabase
        .from("users").select("id,profile_picture,username").eq("id", user.id)
        .single();
      if (currentUserError) throw Error(JSON.stringify(currentUserError));
    } catch (error) {
      console.error(error);
      return null;
    }
  })();

  const userData = await getProfileData(supabase, id);
  if (userData == null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-center">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-white">
            Search Results for userid "{id}"
          </h1>
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <ProfileHeader profile={userData.profile} />
      <ProfileTabs
        pictures={userData.pictures}
        rates={userData.rates}
        testimonials={userData.testimonials}
        user={userData.profile}
        currentUser={user}
      />
    </main>
  );
}
