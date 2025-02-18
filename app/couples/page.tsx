import { EscortCard } from "@/components/escort-card";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getRandomImage from "@/lib/randomImage";

export default async function CouplesPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: couples, error } = await supabase.from("users").select("*").eq(
    "user_type",
    "Couple",
  );

  if (error) {
    console.error("Error fetching couples:", error);
    return <div>Error loading couples. Please try again later.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-background dark:from-black dark:via-gray-900 dark:to-black">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
          Couples
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {couples.map((couple) => (
            <EscortCard
              key={couple.id}
              id={couple.id}
              name={couple.username}
              age={couple.age}
              location={couple.location_name}
              measurements={couple.size}
              price={couple.price}
              image={couple.profile_picture || getRandomImage()}
              availability={couple.availability}
              isVerified={couple.is_verified}
              isVip={couple.is_vip}
              isOnline={false}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
