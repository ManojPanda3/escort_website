'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface StoryViewerProps {
  id: string
  url: string
  title: string
  isVideo?: boolean
  onClose: () => void
}

export function StoryViewer({ id, url, title, isVideo, onClose }: StoryViewerProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] p-0 overflow-hidden">
        <div className="relative w-full h-[80vh]">
          {isVideo ? (
            <div className="w-full h-full">
              <video 
                src={url} 
                className="absolute w-full h-full object-cover" 
                controls 
                autoPlay 
                loop 
                style={{ objectFit: 'cover' }}
              />
            </div>
          ) : (
            <Image src={url || "/placeholder.svg"} alt={title} layout="fill" objectFit="cover" />
          )}
        </div>
        <Button onClick={onClose} className="absolute top-4 right-4 text-white">
          Close
        </Button>
      </DialogContent>
    </Dialog>
  )
}
