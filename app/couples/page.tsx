import { EscortCard } from "@/components/escort-card";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import HeroCard from "@/components/HeroCard.tsx";
import { UserWrapper } from "@/components/Users";

export default async function EscortsPage(
  { searchParams }: { searchParams: { location?: string; gender?: string } },
) {
  const supabase = createServerComponentClient({ cookies });
  const search_params = await searchParams;
  const location = search_params?.location;
  const gender = search_params?.gender;

  let query = supabase.from("users").select("*").eq("user_type", "escort");

  // Apply location filter, handling "all locations"
  if (
    location && location.trim() !== "" &&
    location.toLocaleLowerCase() === "all locations"
  ) {
    query = query.eq("location_name", location);
  }

  // Apply gender filter, handling "viewall"
  if (
    gender && gender.trim() !== "" &&
    gender.toLocaleLowerCase() === "viewall"
  ) {
    query = query.eq("gender", gender);
  }
  query = query
    .order("ratings", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(20)
    ;

  const { data: escorts, error } = await query;

  if (error) {
    console.error("Error fetching escorts:", error);
    return <div>Error loading escorts. Please try again later.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-background dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <HeroCard
          label={`Escorts ${location ? "in " + location : ""}`}
          initial_location={location || ""}
          initial_gender={gender || ""}
        />
        <div className="px-2">
          <UserWrapper
            users={escorts}
            userType={"escort"}
            location={location}
            gender={gender}
          />
        </div>
      </div>
    </div>
  );
}
