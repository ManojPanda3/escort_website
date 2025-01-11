'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface AddPictureModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddPictureModal({ isOpen, onClose }: AddPictureModalProps) {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [isMain, setIsMain] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('title', title)
    formData.append('isMain', String(isMain))

    try {
      const response = await fetch('/api/profile/addImage', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Failed to upload image')

      router.refresh()
      onClose()
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Picture</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="picture">Picture</Label>
            <Input
              id="picture"
              type="file"
              accept="image/*"
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
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isMain"
              checked={isMain}
              onCheckedChange={(checked) => setIsMain(checked as boolean)}
            />
            <Label htmlFor="isMain">Set as main picture</Label>
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload Picture
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

