'use client'
import { useEffect, useReducer, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { AlertCircle, Loader2, Plus } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Success } from '@/components/ui/success'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

interface EditProfileFormProps {
  profile: any
}

type FormState = {
  name: string
  about: string
  location: string
  location_name: string
  place_of_service: string
  phone_number: string
  height: string
  dress_size: string
  hair_color: string
  eye_color: string
  body_type: string
  interest: string
  profile_picture: string
  cover_image: string
}

type Action =
  | { type: 'SET_FIELD'; field: keyof FormState; value: string }
  | { type: 'RESET'; payload: FormState }

const formReducer = (state: FormState, action: Action): FormState => {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value }
    case 'RESET':
      return action.payload
    default:
      return state
  }
}

export function EditProfileForm({ profile }: EditProfileFormProps) {
  const [locationId, setLocationId] = useState('')
  const [locations, setLocations] = useState<Location[]>([])
  const router = useRouter()
  const coverImageRef = useRef<HTMLInputElement | null>(null)
  const profilePictureRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const fetchLocations = async () => {
      const { data: locationsData, error } = await supabase
        .from('locations')
        .select('*')
      if (locationsData) {
        setLocations(locationsData)
      }
      if (error) {
        console.error('Error fetching locations:', error)
      }
    }
    fetchLocations()
  }, [])



  const initialState: FormState = {
    name: profile?.name || '',
    about: profile?.about || '',
    location_name: profile?.location_name || '',
    location: profile?.location || '',
    place_of_services: profile?.place_of_service || '',
    phone_number: profile?.phone_number || '',
    height: profile?.height || '',
    dress_size: profile?.dress_size || '',
    hair_color: profile?.hair_color || '',
    eye_color: profile?.eye_color || '',
    body_type: profile?.body_type || '',
    interest: profile?.interest || '',
    profile_picture: profile?.profile_picture || '',
    cover_image: profile?.cover_image || '',
  }

  const [state, dispatch] = useReducer(formReducer, initialState)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleFieldChange = (field: keyof FormState, value: string) => {
    dispatch({ type: 'SET_FIELD', field, value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const body = {};
    Object.entries(state).forEach((data) => {
      if (data[1] === profile[data[0]] || data[1] === '') {
        return;
      }
      body[data[0]] = data[1];
    })
    if (Object.keys(body).length == 0) {
      setError('No Data was updated')
      return;
    }

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const { message } = await response.json()
        setError(message || 'Failed to update profile.')
        throw new Error(message || 'Failed to update profile.')
      }

      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleImageInput = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof FormState) => {
    const file = e.target.files?.[0]
    if (!file) return

    setLoading(true)
    setError('')

    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = async () => {
        const base64String = reader.result as string

        try {
          const tempImage = document.createElement('img')
          tempImage.src = base64String

          tempImage.onload = async () => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')

            if (!ctx) {
              throw new Error('Failed to get canvas context.')
            }

            const maxDimension = 720
            let { width, height } = tempImage

            if (width > maxDimension || height > maxDimension) {
              if (width > height) {
                height = (height * maxDimension) / width
                width = maxDimension
              } else {
                width = (width * maxDimension) / height
                height = maxDimension
              }
            }

            canvas.width = Math.floor(width)
            canvas.height = Math.floor(height)

            ctx.drawImage(tempImage, 0, 0, canvas.width, canvas.height)

            const webpDataUrl = canvas.toDataURL('image/webp', 0.9)

            dispatch({ type: 'SET_FIELD', field, value: webpDataUrl })
          }

          tempImage.onerror = () => {
            throw new Error('Failed to process the image. Please try again.')
          }
        } catch (error) {
          setError((error as Error).message)
        } finally {
          setLoading(false)
        }
      }

      reader.onerror = () => {
        setError('Failed to read the image. Please try again.')
        setLoading(false)
      }
    } catch (error) {
      setError('An unexpected error occurred while processing the image.')
      setLoading(false)
    }
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
        {success && (
          <Success>{success}</Success>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Cover Image</Label>
            <div className="flex items-center gap-4 relative h-24 bg-gray-400 outline outline-1 outline-white rounded-sm">
              <div className="h-full w-full relative rounded-sm overflow-hidden ">
                <Image
                  src={state.cover_image || "/placeholder.svg?height=200&width=200"}
                  alt={profile?.name}
                  fill
                  className="object-cover"
                />
              </div>
              <button className="absolute left-0 top-0 flex justify-center items-center w-full h-full" onClick={() => coverImageRef.current?.click()}>
                <Plus color='#000'></Plus>
                <Input
                  type="file"
                  accept="image/*"
                  ref={coverImageRef}
                  onChange={(e) => handleImageInput(e, "cover_image")}
                  disabled={loading}
                  className="hidden absolute top-0 left-0 scale-0"
                />
              </button>
              <div className="space-y-2 w-20 absolute top-2 left-2 h-full ">
                <div className="flex items-center relative gap-4">
                  <div className="h-20 w-20 relative rounded-full overflow-hidden border-2 bg-gray-700">
                    <Image
                      src={state.profile_picture || "/placeholder.svg?height=200&width=200"}
                      alt={profile?.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button className="absolute left-0 top-0 flex justify-center items-center w-full h-full" onClick={() => profilePictureRef.current?.click()}>
                    <Plus color='#000'></Plus>
                    <Input
                      className="hidden absolute top-0 left-0 scale-0"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageInput(e, "profile_picture")}
                      disabled={loading}
                      ref={profilePictureRef}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={state.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location_name">Location</Label>
              <Select value={locationId} onValueChange={setLocationId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={state.phone_number}
                  onChange={(e) => handleFieldChange('phone_number', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="place_of_service">Place of Service</Label>
                <Input
                  id="place_of_service"
                  value={state.place_of_service}
                  onChange={(e) => handleFieldChange('place_of_service', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  value={state.height}
                  onChange={(e) => handleFieldChange('height', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dress_size">Dress Size</Label>
                <Input
                  id="dress_size"
                  type="number"
                  value={state.dress_size}
                  onChange={(e) => handleFieldChange('dress_size', e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hair_color">Hair Color</Label>
                <Select
                  value={state.hair_color}
                  onValueChange={(value) => handleFieldChange('hair_color', value)}
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
                  value={state.eye_color}
                  onValueChange={(value) => handleFieldChange('eye_color', value)}
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
                  value={state.body_type}
                  onValueChange={(value) => handleFieldChange('body_type', value)}
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
                value={state.about}
                onChange={(e) => handleFieldChange('about', e.target.value)}
                disabled={loading}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interest">Interests</Label>
              <Textarea
                id="interest"
                value={state.interest}
                onChange={(e) => handleFieldChange('interest', e.target.value)}
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
