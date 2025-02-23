import { EscortCard } from "@/components/escort-card";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getRandomImage from "../../lib/randomImage.ts";
import HeroCard from "@/components/HeroCard";
import { UserWrapper } from "@/components/Users";

export default async function BDSMPage(
  { searchParams }: { searchParams: { location?: string; gender?: string } },
) {
  const supabase = createServerComponentClient({ cookies });
  const search_params = await searchParams;
  const location = search_params?.location;
  const gender = search_params?.gender;

  let query = supabase.from("users").select("*").eq("user_type", "bdsm");

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

  query = query
    .order("ratings", { ascending: false })
    .order("created_at", { ascending: false });

  const { data: bdsm, error } = await query.limit(20);

  if (error) {
    console.error("Error fetching BDSM users:", error);
    return <div>Error loading BDSM users. Please try again later.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-background dark:from-black dark:via-gray-900 dark:to-black">
      <main className="container mx-auto px-4 py-8">
        <HeroCard label="BDSM" />
        <div className="px-2">
          <UserWrapper
            users={bdsm}
            userType={"bdsm"}
            location={location}
            gender={gender}
          />
        </div>
      </main>
    </div>
  );
}
