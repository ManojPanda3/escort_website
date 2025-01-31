'use client'

import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Calendar, MapPin, Shield, Star } from 'lucide-react'
import { memo } from 'react'

interface EscortCardProps {
  name: string
  age: number
  location: string
  measurements: string
  price: string
  image: string
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
  availability,
  isVerified = false,
  isVip = false,
  isOnline = false
}: EscortCardProps) {
  return (
    <Card 
      className="group relative overflow-hidden rounded-xl bg-black/40 backdrop-blur-sm transition-transform duration-300 hover:scale-[1.02]"
      role="article"
      aria-label={`Profile card for ${name}`}
      itemScope
      itemType="https://schema.org/Person"
    >
      <div className="aspect-[3/4] relative">
        <Image
          src={image || '/placeholder.svg?height=600&width=400'}
          alt={`Profile photo of ${name}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-all duration-500 group-hover:scale-105"
          priority={false}
          loading="lazy"
          itemProp="image"
        />
        
        {/* Availability Overlay - Top */}
        <div 
          className="absolute inset-x-0 top-0 translate-y-[-100%] bg-gradient-to-b from-black/90 to-transparent p-4 text-white transition-transform duration-300 group-hover:translate-y-0"
          aria-label="Availability information"
        >
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />
            <p className="text-sm font-medium" itemProp="availability">{availability}</p>
          </div>
        </div>

        {/* Status Badges */}
        <div className="absolute right-3 top-3 flex flex-col gap-2" aria-label="Status indicators">
          {isOnline && (
            <div 
              className="h-3 w-3 rounded-full bg-green-500 ring-4 ring-green-500/20" 
              aria-label="Online status indicator"
              role="status"
            />
          )}
          {isVerified && (
            <Badge 
              className="bg-blue-500/90 hover:bg-blue-500"
              aria-label="Verification status"
            >
              <Shield className="mr-1 h-3 w-3" aria-hidden="true" />
              <span itemProp="disambiguatingDescription">Verified</span>
            </Badge>
          )}
          {isVip && (
            <Badge 
              className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
              aria-label="VIP status"
            >
              <Star className="mr-1 h-3 w-3" aria-hidden="true" />
              <span itemProp="memberOf">VIP</span>
            </Badge>
          )}
        </div>

        {/* Info Overlay - Bottom */}
        <div 
          className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 text-white"
          aria-label="Profile details"
        >
          <div className="transform space-y-2 transition-transform duration-300 group-hover:translate-y-[-8px]">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold" itemProp="name">{name}</h3>
              <span className="text-lg font-bold text-primary" itemProp="priceRange">{price}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <span itemProp="age">{age} years</span>
              <span aria-hidden="true">•</span>
              <span itemProp="height">{measurements}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-300">
              <MapPin className="h-3 w-3" aria-hidden="true" />
              <span itemProp="location">{location}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
})

EscortCard.displayName = 'EscortCard'