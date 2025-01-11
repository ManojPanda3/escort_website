'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import imageCompression from 'browser-image-compression'
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
import { Checkbox } from '@/components/ui/checkbox'

interface EditProfileFormProps {
  profile: any
}

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Separate states for each field
  const [name, setName] = useState(profile?.name || '')
  const [about, setAbout] = useState(profile?.about || '')
  const [location, setLocation] = useState(profile?.location || '')
  const [placeOfService, setPlaceOfService] = useState(profile?.place_of_service || '')
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone_number || '')
  const [height, setHeight] = useState(profile?.height || '')
  const [dressSize, setDressSize] = useState(profile?.dress_size || '')
  const [hairColor, setHairColor] = useState(profile?.hair_color || '')
  const [eyeColor, setEyeColor] = useState(profile?.eye_color || '')
  const [bodyType, setBodyType] = useState(profile?.body_type || '')
  const [profilePicture, setProfilePicture] = useState(profile?.profile_picture || '')
  const [interest, setInterest] = useState(profile?.interest || '')
  const [isTraveling, setIsTraveling] = useState(profile?.is_traveling || false)
  const [travelingLocation, setTravelingLocation] = useState(profile?.traveling_location || '')
  const [coverImage, setCoverImage] = useState(profile?.cover_image || '')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Handle image upload and convert to WebP
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setStateFunc) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError('')

    try {
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: 'image/webp',
      }
      const compressedFile = await imageCompression(file, options)

      // Convert to Base64
      const reader = new FileReader()
      reader.readAsDataURL(compressedFile)
      reader.onloadend = () => {
        setStateFunc(reader.result as string)
      }
    } catch (error) {
      setError('Failed to process image. Please try again.')
      console.error(error)
    }

    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Construct `sending_body` with only updated fields
    const sending_body: Record<string, any> = {}
    if (profile.name !== name) sending_body.name = name
    if (profile.about !== about) sending_body.about = about
    if (profile.location !== location) sending_body.location = location
    if (profile.place_of_service !== placeOfService) sending_body.place_of_service = placeOfService
    if (profile.phone_number !== phoneNumber) sending_body.phone_number = phoneNumber
    if (profile.height !== height) sending_body.height = parseInt(height)
    if (profile.dress_size !== dressSize) sending_body.dress_size = parseInt(dressSize)
    if (profile.hair_color !== hairColor) sending_body.hair_color = hairColor
    if (profile.eye_color !== eyeColor) sending_body.eye_color = eyeColor
    if (profile.body_type !== bodyType) sending_body.body_type = bodyType
    if (profile.profile_picture !== profilePicture) sending_body.profile_picture = profilePicture
    if (profile.interest !== interest) sending_body.interest = interest
    if (profile.is_traveling !== isTraveling) sending_body.is_traveling = isTraveling
    if (profile.traveling_location !== travelingLocation) sending_body.traveling_location = travelingLocation
    if (profile.cover_image !== coverImage) sending_body.cover_image = coverImage

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        body: JSON.stringify(sending_body),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status !== 200) {
        const data = await response.json()
        setError(data.message)
      } else {
        router.refresh()
      }
    } catch (error) {
      setError('Failed to update profile.')
      console.error(error)
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
          {/* Profile Picture */}
          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-full rounded-sm relative full overflow-hidden">
                <Image
                  src={coverImage || '/placeholder.svg?height=200&width=200'}
                  alt={name || ''}
                  fill
                  className="object-cover"
                />
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setCoverImage)}
                disabled={loading}
              />
            </div>
          </div>
          {/* Profile Picture */}
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 relative rounded-full overflow-hidden">
                <Image
                  src={profilePicture || '/placeholder.svg?height=200&width=200'}
                  alt={name}
                  fill
                  className="object-cover"
                />
              </div>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, setProfilePicture)}
                disabled={loading}
              />
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} disabled={loading} />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} disabled={loading} />
          </div>

          {/* Place of Service */}
          <div className="space-y-2">
            <Label htmlFor="place_of_service">Place of Service</Label>
            <Input
              id="place_of_service"
              value={placeOfService}
              onChange={(e) => setPlaceOfService(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Height */}
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Dress Size */}
          <div className="space-y-2">
            <Label htmlFor="dress_size">Dress Size</Label>
            <Input
              id="dress_size"
              type="number"
              value={dressSize}
              onChange={(e) => setDressSize(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Hair Color */}
          <div className="space-y-2">
            <Label htmlFor="hair_color">Hair Color</Label>
            <Select
              value={hairColor}
              onValueChange={(value) => setHairColor(value)}
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

          {/* Eye Color */}
          <div className="space-y-2">
            <Label htmlFor="eye_color">Eye Color</Label>
            <Select
              value={eyeColor}
              onValueChange={(value) => setEyeColor(value)}
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

          {/* Body Type */}
          <div className="space-y-2">
            <Label htmlFor="body_type">Body Type</Label>
            <Select
              value={bodyType}
              onValueChange={(value) => setBodyType(value)}
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

          {/* About */}
          <div className="space-y-2">
            <Label htmlFor="about">About</Label>
            <Textarea
              id="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Interest */}
          <div className="space-y-2">
            <Label htmlFor="interest">Interest</Label>
            <Input
              id="interest"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              disabled={loading}
            />
          </div>


          {/* Traveling */}
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <Label>
                <Checkbox
                  checked={isTraveling}
                  onClick={(e) => setIsTraveling(n => !n)}
                />
                Currently Traveling
              </Label>
            </div>
          </div>
          {/* Traveling Location */}
          {isTraveling && (
            <div className="space-y-2">
              <Label htmlFor="traveling_location">Traveling Location</Label>
              <Input
                id="traveling_location"
                value={travelingLocation}
                onChange={(e) => setTravelingLocation(e.target.value)}
                disabled={loading}
              />
            </div>
          )}

          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

