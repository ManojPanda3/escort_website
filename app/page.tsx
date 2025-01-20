import { NavBar } from '@/components/nav-bar'
import { Hero } from '@/components/hero'
import { FeaturedEscorts } from '@/components/featured-escorts'
import { CategoryTabs } from '@/components/category-tabs'
import { EscortCard } from '@/components/escort-card'
import { StoryCircle } from '@/components/story-circle'
import { Footer } from '@/components/footer'
import { MouseGlow } from '@/components/mouse-glow'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import Link from 'next/link'

export default async function Page() {
  const supabase = createServerComponentClient({ cookies })
  let { data: users, error: userError } = (await supabase
    .from('users')
    .select('*')
    .neq('user_type', 'general')
    .limit(4))
  if (userError) {
    console.error('Error fetching stories:', userError);
    return;
  }
  const userIds = users.map(user => user.id);
  const { data: stories, error: storyError } = await supabase
    .from('story')
    .select("*")
    .in('owner', userIds)

  if (storyError) {
    console.error('Error fetching stories:', storyError);
    return;
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-background dark:from-black dark:via-gray-900 dark:to-black">
      <MouseGlow />
      <NavBar />
      <Hero />
      <FeaturedEscorts users={users.slice(0, 3)} />
      <div className="container mx-auto px-4 py-6 text-foreground">
        {/* Stories Section */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-4 pb-2">
            {stories.map((story, index) => (
              <StoryCircle
                key={story.name}
                {...story}
                isVideo={story.isvideo}
                isActive={index === 0}
              />
            ))}
          </div>
        </div>

        <div className="mb-8">
          <CategoryTabs />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {users && users.map((user) => (
            <Link key={user.id} href={`/profile/${user.id}`}>
              <EscortCard
                name={user.username}
                age={user.age}
                location={user.location_name}
                measurements={user.size}
                price={user.price}
                image={user.profile_picture || '/placeholder.svg?height=600&width=400'}
                availability={user.availability}
                isVerified={user.is_verified}
                isVip={user.is_vip}
                isOnline={false}
              />
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
