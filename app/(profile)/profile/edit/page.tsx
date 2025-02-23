import { Suspense } from "react"
import { EditProfileForm } from "./edit-profile-form"
import { LoadingSpinner } from "@/components/ui/loading";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function EditProfilePage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user.id) {
    redirect("/auth/login");
  }
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
        Edit Your Profile
      </h1>
      <Suspense fallback={<LoadingSpinner />}>
        <EditProfileForm />
      </Suspense >
    </main>
  )
}


