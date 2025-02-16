// app/profile/edit/page.tsx
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { EditProfileForm } from "./edit-profile-form";
import { SubscriptionPlans } from "./subscription-plans";
import { Success } from "@/components/ui/success";
import { Database } from "@/lib/database.types";
import { LoadingSpinner } from "@/components/ui/loading";

export default async function EditProfilePage() {
  const supabase = createServerComponentClient<Database>({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }
  const { data: profile, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();
  if (profile == null) redirect("/auth/login");
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (!profile) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <EditProfileForm profile={profile} />
        <SubscriptionPlans currentPlan={profile?.current_plan} />
      </div>
    </main>
  );
}

