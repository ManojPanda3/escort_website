'use client'

import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { MapPin, Shield, Star, Phone, Calendar } from 'lucide-react'
import { motion } from 'framer-motion'
import { memo, useState } from 'react'

interface EscortCardProps {
  name: string
  age: number
  location: string
  measurements: string
  price: string
  image: string
  hoverImage?: string
  phone: string
  availability: string
  isVerified?: boolean
  isVip?: boolean
  isOnline?: boolean
}

export const EscortCard = memo(function EscortCard({
  name,
  age,
  location,
  measurements,
  price,
  image,
  hoverImage = `https://picsum.photos/400/600?random=${Math.random()}`,
  phone,
  availability,
  isVerified = true,
  isVip = true,
  isOnline = true
}: EscortCardProps) {
  const [imgSrc, setImgSrc] = useState(image)

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto"
    >
      <Card 
        className="group relative overflow-hidden rounded-xl bg-black/40 backdrop-blur-sm shadow-lg transition-transform duration-300"
        role="article"
        aria-label={`Profile card for ${name}`}
        itemScope
        itemType="https://schema.org/Person"
      >
        {/* Curved Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-t from-indigo-700 to-indigo-900 p-4 rounded-t-xl">
          <div className="flex justify-between items-center text-white">
            <h3 className="text-lg font-semibold">{name}</h3>
            <span className="text-lg font-bold text-amber-400">{price}</span>
          </div>
        </div>

        {/* Image and Hover Effect */}
        <div className="relative aspect-[3/4] w-full">
          <img
            src={imgSrc}
            alt={`Profile photo of ${name}`}
            className="object-cover w-full h-full transition-all duration-500 group-hover:scale-105"
            onMouseEnter={() => setImgSrc(hoverImage)}
            onMouseLeave={() => setImgSrc(image)}
          />
          
          {/* Availability Overlay - Top */}
          <div className="absolute inset-x-0 top-0 translate-y-[-100%] bg-gradient-to-b from-black/90 to-transparent p-4 text-white transition-transform duration-300 group-hover:translate-y-0">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-400" />
              <p className="text-sm font-medium">{availability}</p>
            </div>
          </div>

          {/* Status Badges */}
          <div className="absolute right-3 top-3 flex flex-col gap-2">
            {isOnline && (
              <div className="h-3 w-3 rounded-full bg-green-500 ring-4 ring-green-500/20" />
            )}
            {isVerified && (
              <Badge className="bg-blue-500/90 hover:bg-blue-500">
                <Shield className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            )}
            {isVip && (
              <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:scale-105 text-xs sm:text-sm text-black">
                <Star className="mr-1 h-3 w-3" />
                VIP
              </Badge>
            )}
          </div>

          {/* Info Overlay - Bottom */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 text-white">
            <div className="transform space-y-2 transition-transform duration-300 group-hover:translate-y-[-8px]">
              <div className="flex items-center gap-2 text-sm text-amber-200">
                <span>{age} years</span>
                <span>•</span>
                <span>{measurements}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-amber-200">
                <MapPin className="h-3 w-3" />
                {location}
              </div>
              <div className="flex items-center gap-1 text-sm text-amber-200 mt-1">
                <Phone className="h-3 w-3" />
                {phone}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
})

EscortCard.displayName = 'EscortCard'
