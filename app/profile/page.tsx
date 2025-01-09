'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    pic: '',
    age: '',
    size: '',
    description: '',
    price: '',
    location: '',
    availability: '',
    type: '',
  })
  const [date, setDate] = useState(new Date())
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        if (data) setProfile(data)
      } else {
        router.push('/auth')
      }
    }
    getUser()
  }, [router])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, ...profile })
    if (error) alert(error.message)
    else alert('Profile updated successfully!')
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file)

    if (uploadError) {
      alert(uploadError.message)
    } else {
      setProfile({ ...profile, pic: filePath })
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-gray-900 to-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
          Your Profile
        </h2>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="pic">Profile Picture</Label>
            <Input
              id="pic"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {profile.pic && (
              <div className="mt-2">
                <Image
                  src={`https://your-supabase-project-url.supabase.co/storage/v1/object/public/avatars/${profile.pic}`}
                  alt="Profile"
                  width={100}
                  height={100}
                  className="rounded-full"
                />
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min="18"
              max="200"
              value={profile.age}
              onChange={(e) => setProfile({ ...profile, age: e.target.value })}
              required
            />
          </div>
          {profile.type === 'escort' && (
            <>
              <div>
                <Label htmlFor="size">Size</Label>
                <Input
                  id="size"
                  value={profile.size}
                  onChange={(e) => setProfile({ ...profile, size: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  value={profile.price}
                  onChange={(e) => setProfile({ ...profile, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="availability">Availability</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={
                        "w-full justify-start text-left font-normal"
                      }
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </>
          )}
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={profile.description}
              onChange={(e) => setProfile({ ...profile, description: e.target.value })}
            />
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-black">
            Update Profile
          </Button>
        </form>
      </div>
    </div>
  )
}

