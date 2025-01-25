import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { SwipeInterface } from "@/components/swipe_interface"

export default async function SwipePage() {
  const supabase = createServerComponentClient({ cookies })

  const { data: escorts, error } = await supabase
    .from("users")
    .select("*")
    .neq("user_type", "general")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching escorts:", error)
    return <div>Error loading escorts. Please try again later.</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-background dark:from-black dark:via-gray-900 dark:to-black">
      <SwipeInterface escorts={escorts} />
    </div>
  )
}
