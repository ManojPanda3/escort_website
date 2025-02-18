import { EscortCard } from "@/components/escort-card";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getRandomImage from "../../lib/randomImage.ts";

export default async function BDSMPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: bdsmUsers, error } = await supabase.from("users").select("*")
    .eq("user_type", "BDSM");

  if (error) {
    console.error("Error fetching BDSM users:", error);
    return <div>Error loading BDSM users. Please try again later.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-background dark:from-black dark:via-gray-900 dark:to-black">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
          BDSM
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bdsmUsers.map((user) => (
            <EscortCard
              key={user.id}
              id={user.id}
              name={user.username}
              age={user.age}
              location={user.location_name}
              measurements={user.size}
              price={user.price}
              image={user.profile_picture || getRandomImage()}
              availability={user.availability}
              isVerified={user.is_verified}
              isVip={user.is_vip}
              isOnline={false}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
