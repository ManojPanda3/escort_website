import { NavBar } from '@/components/nav-bar'
import { Hero } from '@/components/hero'
import { FeaturedEscorts } from '@/components/featured-escorts'
import { CategoryTabs } from '@/components/category-tabs'
import { EscortCard } from '@/components/escort-card'
import { StoryCircle } from '@/components/story-circle'
import { Footer } from '@/components/footer'

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

const escorts = [
  {
    name: 'Emma',
    age: 23,
    location: 'Sydney CBD',
    measurements: '34C-24-36',
    price: '$400/hr',
    image: '/placeholder.svg?height=600&width=400',
    availability: 'Available Today 10 AM - Late',
    isVerified: true,
    isVip: true,
    isOnline: true
  },
  {
    name: 'Sophia',
    age: 25,
    location: 'Melbourne CBD',
    measurements: '36D-26-36',
    price: '$350/hr',
    image: '/placeholder.svg?height=600&width=400',
    availability: 'Available Tomorrow',
    isVerified: true,
    isOnline: false
  },
  {
    name: 'Isabella',
    age: 22,
    location: 'Brisbane CBD',
    measurements: '32C-23-34',
    price: '$300/hr',
    image: '/placeholder.svg?height=600&width=400',
    availability: 'Available Now',
    isVip: true,
    isOnline: true
  },
  {
    name: 'Olivia',
    age: 24,
    location: 'Perth CBD',
    measurements: '34D-25-36',
    price: '$450/hr',
    image: '/placeholder.svg?height=600&width=400',
    availability: 'Available Today',
    isVerified: true,
    isVip: true,
    isOnline: false
  },
]

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
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
          {escorts.map((escort) => (
            <EscortCard
              key={escort.name}
              {...escort}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}

