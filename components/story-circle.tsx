'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { StoryViewer } from './story-viewer'

interface StoryCircleProps {
  id: string
  url: string
  title: string
  avatar_image: string
  isVideo?: boolean
  isActive?: boolean
}

export function StoryCircle({ id, url, title, isVideo, avatar_image, isActive }: StoryCircleProps) {
  const [showStoryViewer, setShowStoryViewer] = useState(false)

  const handleClick = () => {
    setShowStoryViewer(true)
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="group flex flex-col items-center gap-1"
      >
        <div className={cn(
          "p-0.5 rounded-full",
          isActive ? "bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600" : "bg-gray-700"
        )}>
          <div className="p-0.5 rounded-full bg-black">
            <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-black">
              <Image
                src={avatar_image}
                alt={title}
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
          {title}
        </span>
      </button>

      {showStoryViewer && (
        <StoryViewer
          id={id}
          url={url}
          title={title}
          isVideo={isVideo}
          onClose={() => setShowStoryViewer(false)}
        />
      )}
    </>
  )
}
