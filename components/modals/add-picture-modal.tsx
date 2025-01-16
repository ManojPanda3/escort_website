'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { uploadToStorage } from '@/lib/storage'

interface AddPictureModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  setError: (error: string) => void
}

export function AddPictureModal({ 
  isOpen, 
  onClose, 
  userId,
  setError,
}: AddPictureModalProps) {
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [isMain, setIsMain] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()

  const convertToWebP = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          canvas.width = img.width
          canvas.height = img.height
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Failed to get canvas context'))
            return
          }
          ctx.drawImage(img, 0, 0)
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob)
            } else {
              reject(new Error('Failed to convert to WebP'))
            }
          }, 'image/webp', 0.8)
        }
        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = e.target?.result as string
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }

  const validateFileSize = (file: File): boolean => {
    const maxSize = 12 * 1024 * 1024; // 12MB in bytes
    return file.size <= maxSize;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    // Validate file size
    if (!validateFileSize(file)) {
      setError("File size must be 12MB or less")
      return
    }

    setLoading(true)
    const formData = new FormData()
    formData.append('title', title)
    formData.append('isMain', String(isMain))

    try {
      // Convert to WebP before uploading
      const webpBlob = await convertToWebP(file)
      const webpFile = new File([webpBlob], file.name.replace(/\.[^/.]+$/, '.webp'), {
        type: 'image/webp'
      })

      
      const picture = await uploadToStorage(webpFile, userId)
      if (!picture.fileUrl) throw new Error('Failed to upload to storage')
      
      formData.append('picture', picture.fileUrl)
      const response = await fetch('/api/profile/addImage', {
        method: 'POST',
        body: formData,
      })
      if (!response.ok) throw new Error('Failed to upload image')
      const data = await response.json()
      const webpUrl = URL.createObjectURL(webpFile)
      onClose({
        id: data.id,
        title,
        isMain,
        picture: webpUrl
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      setError('Failed to upload image. Please try again.')
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
