'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AlertCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface EditProfileFormProps {
  profile: any
}

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    about: profile?.about || '',
    location: profile?.location || '',
    place_of_service: profile?.place_of_service || '',
    phone_number: profile?.phone_number || '',
    height: profile?.height || '',
    dress_size: profile?.dress_size || '',
    hair_color: profile?.hair_color || '',
    eye_color: profile?.eye_color || '',
    body_type: profile?.body_type || '',
    is_traveling: profile?.is_traveling || false,
    traveling_location: profile?.traveling_location || '',
    interest: profile?.interest || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase
      .from('users')
      .update(formData)
      .eq('id', profile?.id)

    if (error) {
      setError(error.message)
    } else {
      router.refresh()
    }

    setLoading(false)
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError('')

    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `${profile?.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('profile_pictures')
      .upload(filePath, file)

    if (uploadError) {
      setError(uploadError.message)
    } else {
      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_picture: filePath })
        .eq('id', profile?.id)

      if (updateError) {
        setError(updateError.message)
      } else {
        router.refresh()
      }
    }

    setLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 relative rounded-full overflow-hidden">
                <Image
                  src={profile?.profile_picture || '/placeholder.svg?height=200&width=200'}
                  alt={profile?.name}
                  fill
                  className="object-cover"
                />
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone_number}
                onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="place_of_service">Place of Service</Label>
              <Input
                id="place_of_service"
                value={formData.place_of_service}
                onChange={(e) => setFormData({ ...formData, place_of_service: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dress_size">Dress Size</Label>
              <Input
                id="dress_size"
                type="number"
                value={formData.dress_size}
                onChange={(e) => setFormData({ ...formData, dress_size: e.target.value })}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hair_color">Hair Color</Label>
              <Select
                value={formData.hair_color}
                onValueChange={(value) => setFormData({ ...formData, hair_color: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hair color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="brown">Brown</SelectItem>
                  <SelectItem value="blonde">Blonde</SelectItem>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eye_color">Eye Color</Label>
              <Select
                value={formData.eye_color}
                onValueChange={(value) => setFormData({ ...formData, eye_color: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select eye color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="brown">Brown</SelectItem>
                  <SelectItem value="blue">Blue</SelectItem>
                  <SelectItem value="green">Green</SelectItem>
                  <SelectItem value="hazel">Hazel</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="body_type">Body Type</Label>
              <Select
                value={formData.body_type}
                onValueChange={(value) => setFormData({ ...formData, body_type: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select body type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="slim">Slim</SelectItem>
                  <SelectItem value="athletic">Athletic</SelectItem>
                  <SelectItem value="curvy">Curvy</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              value={formData.about}
              onChange={(e) => setFormData({ ...formData, about: e.target.value })}
              disabled={loading}
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interest">Interests</Label>
            <Textarea
              id="interest"
              value={formData.interest}
              onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
              disabled={loading}
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

