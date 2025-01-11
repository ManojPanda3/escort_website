'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface AddStoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddStoryModal({ isOpen, onClose }: AddStoryModalProps) {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)

    try {
      const response = await fetch('/api/profile/addStory', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to upload story')

      router.refresh()
      onClose()
    } catch (error) {
      console.error('Error uploading story:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Story</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="story">Media File</Label>
            <Input
              id="story"
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              required
            />
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload Story
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

