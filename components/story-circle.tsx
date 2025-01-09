'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface StoryCircleProps {
  image: string
  name: string
  isActive?: boolean
  hasNewStory?: boolean
}

export function StoryCircle({ image, name, isActive, hasNewStory }: StoryCircleProps) {
  return (
    <button className="group flex flex-col items-center gap-1">
      <div className={cn(
        "p-0.5 rounded-full",
        hasNewStory ? "bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600" : "bg-gray-700"
      )}>
        <div className="p-0.5 rounded-full bg-black">
          <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-black">
            <Image
              src={image}
              alt={name}
              fill
              className={cn(
                "object-cover transition-opacity duration-300",
                isActive ? "opacity-100" : "group-hover:opacity-100 opacity-75"
              )}
            />
          </div>
        </div>
      </div>
      <span className="text-xs text-gray-300 group-hover:text-white transition-colors">
        {name}
      </span>
    </button>
  )
}

