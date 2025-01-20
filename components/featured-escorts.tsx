'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface FeaturedEscortProps {
  username: string
  profile_picture: string
  age: number
  location_name: string
  price: string
}

function FeaturedEscort({ username, profile_picture, age, location_name, price }: FeaturedEscortProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="group relative overflow-hidden rounded-xl bg-black/40 backdrop-blur-sm cursor-pointer">
        <div className="relative aspect-[2/3]">
          <Image
            src={profile_picture}
            alt={username}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Premium Badge */}
          {/* <div className="absolute left-4 top-4"> */}
          {/*   <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold"> */}
          {/*     <Star className="mr-1 h-4 w-4" /> {} */}
          {/*   </Badge> */}
          {/* </div> */}

          {/* Content Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
            <div className="absolute bottom-0 w-full p-6 space-y-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-white">{name}</h3>
                <div className="flex items-center gap-2 text-amber-300">
                  <span>{age} years</span>
                  <span>•</span>
                  <span>{price}</span>
                </div>
              </div>

              <div className="space-y-2 text-gray-300">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{location_name}</span>
                </div>
                {/* <div className="flex items-center gap-2"> */}
                {/*   <Calendar className="h-4 w-4" /> */}
                {/*   <span>{availability}</span> */}
                {/* </div> */}
              </div>

              <button className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold py-2 rounded-full hover:from-amber-600 hover:to-yellow-600 transition-all duration-300">
                View Profile
              </button>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export function FeaturedEscorts({ users }: { users: any }) {
  console.log(users[0])
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
        Featured Escorts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.map((escort) => (
          <FeaturedEscort
            key={escort.username}
            profile_picture={escort.profile_picture || "/randomImages"}
            location_name={escort.location_name}
            username={escort.username}
            age={escort.age}
            price={escort.price}
          />
        ))}
      </div>
    </div>
  )
}

