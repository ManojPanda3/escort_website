import { EscortCard } from "@/components/escort-card";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getRandomImage from "../../lib/randomImage.ts";
import HeroCard from "@/components/HeroCard";

export default async function BDSMPage(
  { searchParams }: { searchParams: { location?: string; gender?: string } },
) {
  const supabase = createServerComponentClient({ cookies });
  const search_params = await searchParams;
  const location = search_params?.location;
  const gender = search_params?.gender;

  let query = supabase.from("users").select("*").eq("user_type", "BDSM");

  if (
    location && location.trim() !== "" &&
    location.toLocaleLowerCase() === "all locations"
  ) {
    query = query.eq("location_name", location);
  }

  if (
    gender && gender.trim() !== "" && gender.toLocaleLowerCase() === "viewall"
  ) {
    query = query.eq("gender", gender);
  }

  const { data: bdsmUsers, error } = await query;

  if (error) {
    console.error("Error fetching BDSM users:", error);
    return <div>Error loading BDSM users. Please try again later.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-background dark:from-black dark:via-gray-900 dark:to-black">
      <main className="container mx-auto px-4 py-8">
        <HeroCard label="BDSM" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bdsmUsers?.map((user) => (
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
