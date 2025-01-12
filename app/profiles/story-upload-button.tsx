'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface StoryUploadButtonProps {
  userId: string
}

export function StoryUploadButton({ userId }: StoryUploadButtonProps) {
  const [uploading, setUploading] = useState(false)
  const router = useRouter()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return

    setUploading(true)
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId)

    try {
      const response = await fetch('/api/profile/addStory', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      router.refresh()
    } catch (error) {
      console.error('Error uploading story:', error)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="relative">
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleUpload}
        className="hidden"
        id="story-upload"
        disabled={uploading}
      />
      <label htmlFor="story-upload">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full h-14 w-14"
          disabled={uploading}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </label>
    </div>
  )
}

