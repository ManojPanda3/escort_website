import { NavBar } from '@/components/nav-bar'
import { Hero } from '@/components/hero'
import { FeaturedEscorts } from '@/components/featured-escorts'
import { CategoryTabs } from '@/components/category-tabs'
import { EscortCard } from '@/components/escort-card'
import { StoryCircle } from '@/components/story-circle'
import { Footer } from '@/components/footer'
import { MouseGlow } from '@/components/mouse-glow'
import { supabase } from '@/lib/supabase'

const stories = [
  { name: 'Emma', image: '/placeholder.svg?height=200&width=200', hasNewStory: true },
  { name: 'Sophia', image: '/placeholder.svg?height=200&width=200', hasNewStory: true },
  { name: 'Isabella', image: '/placeholder.svg?height=200&width=200', hasNewStory: false },
  { name: 'Olivia', image: '/placeholder.svg?height=200&width=200', hasNewStory: true },
  { name: 'Ava', image: '/placeholder.svg?height=200&width=200', hasNewStory: false },
  { name: 'Mia', image: '/placeholder.svg?height=200&width=200', hasNewStory: true },
  { name: 'Luna', image: '/placeholder.svg?height=200&width=200', hasNewStory: true },
  { name: 'Charlotte', image: '/placeholder.svg?height=200&width=200', hasNewStory: false },
]

export default async function Page() {
  const { data: escorts, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('type', 'escort')
    .limit(4)
  if (error)
    console.error("Error while loading profile")

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <MouseGlow />
      <NavBar />
      <Hero />
      <FeaturedEscorts />
      <div className="container mx-auto px-4 py-6">
        {/* Stories Section */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-4 pb-2">
            {stories.map((story, index) => (
              <StoryCircle
                key={story.name}
                {...story}
                isActive={index === 0}
              />
            ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="mb-8">
          <CategoryTabs />
        </div>

        {/* Escorts Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {escorts && escorts.map((escort) => (
            <EscortCard
              key={escort.id}
              name={escort.username}
              age={escort.age}
              location={escort.location}
              measurements={escort.size}
              price={escort.price}
              image={escort.pic || '/placeholder.svg?height=600&width=400'}
              availability={escort.availability}
              isVerified={escort.is_verified}
              isVip={escort.is_vip}
              isOnline={false}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

