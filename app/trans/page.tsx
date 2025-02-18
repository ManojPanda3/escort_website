import { EscortCard } from "@/components/escort-card";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function TransPage() {
  const supabase = createServerComponentClient({ cookies });

  const { data: transUsers, error } = await supabase.from("users").select("*")
    .eq("user_type", "trans");

  if (error) {
    console.error("Error fetching trans users:", error);
    return <div>Error loading trans escorts. Please try again later.</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-background dark:from-black dark:via-gray-900 dark:to-black">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
          Trans Escorts
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {transUsers.map((user) => (
            <EscortCard
              key={user.id}
              id={user.id}
              name={user.username}
              age={user.age}
              location={user.location_name}
              measurements={user.size}
              price={user.price}
              image={user.profile_picture ||
                "/placeholder.svg?height=600&width=400"}
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
