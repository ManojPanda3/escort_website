'use client'

import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Star } from 'lucide-react'
import { motion } from 'framer-motion'

interface FeaturedEscortProps {
  name: string
  image: string
  title: string
  age: number
  location: string
  price: string
  availability: string
}

function FeaturedEscort({ name, image, title, age, location, price, availability }: FeaturedEscortProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="group relative overflow-hidden rounded-xl bg-black/40 backdrop-blur-sm">
        <div className="relative aspect-[2/3]">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Premium Badge */}
          <div className="absolute left-4 top-4">
            <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold">
              <Star className="mr-1 h-4 w-4" /> {title}
            </Badge>
          </div>

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
                  <span>{location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{availability}</span>
                </div>
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

export function FeaturedEscorts() {
  const featuredEscorts = [
    {
      name: "Sophia",
      age: 23,
      location: "Sydney CBD",
      price: "$400/hr",
      image: "/placeholder.svg?height=800&width=600",
      title: "Escort of the Day",
      availability: "Available Today 10 AM - Late"
    },
    {
      name: "Emma",
      age: 25,
      location: "Melbourne CBD",
      price: "$450/hr",
      image: "/placeholder.svg?height=800&width=600",
      title: "Escort of the Week",
      availability: "Available Now"
    },
    {
      name: "Isabella",
      age: 22,
      location: "Brisbane CBD",
      price: "$500/hr",
      image: "/placeholder.svg?height=800&width=600",
      title: "Escort of the Month",
      availability: "Available Today"
    }
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
        Featured Escorts
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuredEscorts.map((escort) => (
          <FeaturedEscort key={escort.name} {...escort} />
        ))}
      </div>
    </div>
  )
}

