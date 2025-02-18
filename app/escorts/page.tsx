import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { EscortCard } from "@/components/escort-card";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function EscortsPage(
  { searchParams }: { searchParams: { location?: string } },
) {
  const supabase = createServerComponentClient({ cookies });
  const location = searchParams.location;

  let query = supabase.from("users").select("*").eq("user_type", "escort");
  if (location) {
    query = query.eq("location_name", location);
  }

  const { data: escorts, error } = await query;

  if (error) {
    console.error("Error fetching escorts:", error);
    return <div>Error loading escorts. Please try again later.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-background dark:from-black dark:via-gray-900 dark:to-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
          Escorts {location ? `in ${location}` : ""}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {escorts.map((escort) => (
            <EscortCard
              key={escort.id}
              id={escort.id}
              name={escort.username}
              age={escort.age}
              location={escort.location_name}
              measurements={escort.size}
              price={escort.price}
              image={escort.profile_picture}
              availability={escort.availability}
              isVerified={escort.is_verified}
              isVip={escort.is_vip}
              isOnline={false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
