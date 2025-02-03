'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { MapPin } from 'lucide-react'

interface FeaturedEscortProps {
  username: string
  profile_picture: string
  age: number
  location_name: string
  price: string
}

function FeaturedEscort({ username, profile_picture, age, location_name, price }: FeaturedEscortProps) {
  return (
    <div className="transform transition-transform duration-200 hover:scale-[1.02]">
      <Card 
        className="group relative overflow-hidden rounded-xl bg-black/40 backdrop-blur-sm cursor-pointer"
        role="article"
        aria-label={`Featured escort ${username}`}
      >
        <div className="relative aspect-[2/3]">
          <Image
            src={profile_picture}
            alt={`Profile photo of ${username}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={true}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <div className="absolute bottom-0 w-full p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">{username}</h3>
                <div className="flex items-center gap-2 text-amber-300">
                  <span>{age} years</span>
                  <span aria-hidden="true">•</span>
                  <span>{price}</span>
                </div>
              </div>

              <div className="space-y-2 text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  <span>{location_name}</span>
                </div>
              </div>

              <button 
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold py-2 rounded-full transition-colors duration-300 hover:from-amber-600 hover:to-yellow-600"
                aria-label={`View ${username}'s profile`}
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

export function FeaturedEscorts({ users }: { users: FeaturedEscortProps[] }) {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
        Featured Escorts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map((escort) => (
          <FeaturedEscort
            key={escort.username}
            profile_picture={escort.profile_picture || "/placeholder.svg"}
            location_name={escort.location_name}
            username={escort.username}
            age={escort.age}
            price={escort.price}
          />
        ))}
      </div>
    </section>
  )
}