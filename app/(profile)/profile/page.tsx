// app/profile/page.tsx
import { notFound, redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { decode } from "jsonwebtoken"; // Import the decode function

// Components
import { ProfileTabsWrapper } from "./profile-tabs-wrapper";
import { StoryUploadButton } from "./story-upload-button";
import { Database } from "@/lib/database.types";
import { ProfileHeaderWrapper } from "./profile-header-wrapper.tsx";
import { AvailabilityUpdater } from "@/components/AvailabilityUpdater"; // Import
import StoryWrapper from "./story-wrapper";

export default async function ProfilePage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError || !session) {
    redirect("/auth/login"); // Redirect if no session
    return null; //  redirect does this automatically
  }

  let userId: string | null = null;
  try {
    const decodedToken: any = decode(session.access_token); // Decode the JWT
    userId = decodedToken?.sub || null; // 'sub' is the user ID (subject)
  } catch (error) {
    console.error("Error decoding JWT:", error);
    redirect("/auth/login"); // Redirect if JWT decoding fails
    return null; // redirect should handle this
  }

  if (!userId) {
    redirect("/auth/login"); // Redirect if user ID is still null
    return null; // redirect should handle this
  }

  // Fetch user details (including user_type, location, availability) from the 'users' table.
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("user_type, location_name, availability") // Fetch location and availability
    .eq("id", userId)
    .single();

  if (userError || !userData) {
    console.error("Error fetching user data:", userError);
    notFound();
    return null;
  }

  const isGeneralUser = userData.user_type === "general";

  // Fetch available locations (you might get this from a database table or a config file)
  // Example (replace with your actual data fetching):
  const availableLocations = [
    "kathmandu",
    "pokhara",
    "lalitpur",
    "bhaktapur",
    "biratnagar",
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <ProfileHeaderWrapper />
      {/* Availability Updater Component (Conditionally rendered) */}
      {!isGeneralUser && (
        <div className="mb-6">
          <AvailabilityUpdater />
        </div>
      )}
      <StoryWrapper />

      {!isGeneralUser && <ProfileTabsWrapper userId={userId} />}
    </main>
  );
}
export const runtime = "edge"
