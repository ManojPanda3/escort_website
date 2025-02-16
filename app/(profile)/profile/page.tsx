// app/profile/page.tsx
import { notFound, redirect } from "next/navigation";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

// Components
import { ProfileTabsWrapper } from "./profile-tabs-wrapper";
import { StoryUploadButton } from "./story-upload-button";
import { Database } from "@/lib/database.types";
import { ProfileHeaderWrapper } from "./profile-header-wrapper.tsx";

type User = Database["public"]["Tables"]["users"]["Row"];

export default async function ProfilePage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: { user: authUser }, error: authError } = await supabase.auth
    .getUser();

  if (authError || !authUser) {
    redirect("/auth/login"); // Redirect if not authenticated
    return null; //  redirect does this automatically
  }

  // We ONLY need the user ID at this stage.  Everything else comes from the cache.
  const userId = authUser.id;

  return (
    <main className="container mx-auto px-4 py-8">
      {/* ProfileHeader will get data from useUserData, so we don't pass anything here */}
      <ProfileHeaderWrapper userId={userId} />
      <div className="mb-6">
        {/* Pass an empty stories array.  StoryUploadButton should handle this gracefully. */}
        <StoryUploadButton userId={userId} stories={[]} />
      </div>
      <ProfileTabsWrapper userId={userId} />
    </main>
  );
}
