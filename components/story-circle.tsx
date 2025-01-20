'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { StoryViewer } from './story-viewer'

interface StoryCircleProps {
  id: string
  url: string
  title: string
  isVideo?: boolean
}

export function StoryCircle({ id, url, title, isVideo }: StoryCircleProps) {
  const [thumbnailUrl, setThumbnailUrl] = useState(url)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isVideo) {
      const video = document.createElement('video')
      video.crossOrigin = 'anonymous'
      video.src = url

      video.addEventListener('loadeddata', () => {
        video.currentTime = 0

        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
          const thumbnailDataUrl = canvas.toDataURL('image/jpeg')
          setThumbnailUrl(thumbnailDataUrl)
        }
      })
    }
  }, [url, isVideo])

  return (
    <>
      <button
        className="group flex flex-col items-center gap-1"
        onClick={() => setIsOpen(true)}
      >
        <div className="p-0.5 rounded-full bg-gray-700">
          <div className="p-0.5 rounded-full bg-black">
            <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-black">
              <Image
                src={thumbnailUrl || "/placeholder.svg"}
                alt={title}
                fill
                className={cn(
                  "object-cover transition-opacity duration-300",
                  isVideo ? "opacity-100" : "group-hover:opacity-100 opacity-75"
                )}
              />
            </div>
          </div>
        </div>
        <span className="text-xs text-gray-300 group-hover:text-white transition-colors">
          {title}
        </span>
      </button>
      {isOpen && (
        <StoryViewer
          id={id}
          url={url}
          title={title}
          isVideo={isVideo}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
