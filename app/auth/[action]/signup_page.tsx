"use client"

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Eye, EyeOff, Plus, X, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LoadingSpinner } from '@/components/ui/loading'
import { uploadToStorage } from '@/lib/storage'
import { PasswordInput } from './login_page'

interface Location {
  id: string
  name: string
  country: string
  region: string
  city: string
  created_at: string
}

interface FileUploadHandlerProps {
  fileNumber: 1 | 2;
  preview: string | null;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>, fileNumber: 1 | 2) => void;
  handleDeleteFile: (fileNumber: 1 | 2) => void;
  uploaderRef: React.RefObject<HTMLInputElement | null>;
}

function FileUploadHandler({ fileNumber, preview, handleFileChange, handleDeleteFile, uploaderRef }: FileUploadHandlerProps) {
  return (
    <div>
      <Label htmlFor={`ageProof${fileNumber}`}>Image {fileNumber}</Label>
      <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        {preview ? (
          <div className="relative">
            <img src={preview} alt={`Age Proof ${fileNumber}`} className="max-h-40 rounded" />
            <button
              type="button"
              onClick={() => handleDeleteFile(fileNumber)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div
            className="space-y-1 text-center cursor-pointer"
            onClick={() => uploaderRef.current?.click()}
          >
            <Plus className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor={`ageProof${fileNumber}`}
                className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <input
                  ref={uploaderRef}
                  id={`ageProof${fileNumber}`}
                  name={`ageProof${fileNumber}`}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => handleFileChange(e, fileNumber)}
                />
              </label>
            </div>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function SignUpPage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const uploader1 = useRef<HTMLInputElement>(null)
  const uploader2 = useRef<HTMLInputElement>(null)

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [userType, setUserType] = useState('general')
  const [age, setAge] = useState<string>('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [interest, setInterest] = useState('')
  const [gender, setGender] = useState<"male" | "female" | "other">('')
  const [locationId, setLocationId] = useState('')

  // UI state
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAgeProofDialogOpen, setIsAgeProofDialogOpen] = useState(false)

  // File state
  const [ageProofFile, setAgeProofFile] = useState<File | null>(null)
  const [ageProofFile2, setAgeProofFile2] = useState<File | null>(null)
  const [ageProofPreview1, setAgeProofPreview1] = useState<string | null>(null)
  const [ageProofPreview2, setAgeProofPreview2] = useState<string | null>(null)
  const [locations, setLocations] = useState<Location[]>([])

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fileNumber: 1 | 2) => {
    if (!e.target.files?.length) return

    const file = e.target.files[0]
    if (!file.type.startsWith('image/')) {
      setError(`File ${fileNumber} must be an image`)
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError(`File ${fileNumber} size should be less than 5MB`)
      return
    }

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()

    img.onload = async () => {
      let width = img.width
      let height = img.height
      const max_height = 480

      if (height > max_height) {
        width = Math.floor(width * (max_height / height))
        height = max_height
      }

      canvas.width = width
      canvas.height = height
      ctx?.drawImage(img, 0, 0, width, height)

      try {
        const webpBlob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((blob) => blob && resolve(blob), 'image/webp')
        })

        const optimizedFile = new File([webpBlob], file.name.replace(/\.[^/.]+$/, '.webp'), {
          type: 'image/webp'
        })

        const reader = new FileReader()
        reader.onloadend = () => {
          if (fileNumber === 1) {
            setAgeProofFile(optimizedFile)
            setAgeProofPreview1(reader.result as string)
          } else {
            setAgeProofFile2(optimizedFile)
            setAgeProofPreview2(reader.result as string)
          }
        }
        reader.readAsDataURL(optimizedFile)
        setError('')
      } catch (err) {
        setError('Error processing image')
      }
    }

    img.src = URL.createObjectURL(file)
  }

  const handleDeleteFile = (fileNumber: 1 | 2) => {
    if (fileNumber === 1) {
      setAgeProofFile(null)
      setAgeProofPreview1(null)
      if (uploader1.current) uploader1.current.value = ''
    } else {
      setAgeProofFile2(null)
      setAgeProofPreview2(null)
      if (uploader2.current) uploader2.current.value = ''
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions')
      setIsLoading(false)
      return
    }
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${email},username.eq.${username}`);

    if (userData && userData.length > 0) {
      const existingUser = userData[0];
      if (existingUser.email === email) {
        setError('Email already exists');
      } else {
        setError('Username already exists');
      }
      setIsLoading(false);
      return;
    }
    try {
      // Sign up user with Supabase auth first
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username, type: userType },
        },
      })

      if (signUpError) { setError(signUpError.message); return; }

      const userId = authData?.user?.id
      if (!userId) {
        setError('Failed to get auth ID')
        return
      }

      // Create user profile with auth ID
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)
      formData.append('username', username)
      formData.append('userType', userType)
      formData.append('age', age)
      formData.append('interest', interest)
      formData.append('gender', gender)
      formData.append('location', locationId)
      formData.append('locationName', locations.find(location => location.id === locationId)?.name || '')
      formData.append('userId', userId)

      const profileResponse = await fetch('/api/auth/signup', {
        method: 'POST',
        body: formData
      })

      if (!profileResponse.ok) {
        const errorData = await profileResponse.json()
        setError(errorData.message || 'Failed to create user profile')
        return
      }

      // Handle age proof uploads if required
      if (userType !== 'general' && ageProofFile && ageProofFile2) {
        const [upload1, upload2] = await Promise.all([
          uploadToStorage(ageProofFile, userId),
          uploadToStorage(ageProofFile2, userId)
        ])

        if (!upload1.success || !upload2.success) {
          throw new Error(upload1.error || upload2.error)
        }

        await fetch('/api/ageProofUpload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            age_proofs: [upload1.fileUrl, upload2.fileUrl],
            username,
            email,
            userId
          })
        })
      }

      router.push('/auth/login')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-background via-background/80 to-background dark:from-black dark:via-gray-900 dark:to-black">
      {isLoading &&
        <div className="w-full h-full fixed top-0 left-0 bg-transparent flex justify-center items-center before:w-full before:h-full before:fixed before:bg-black before:opacity-30 z-50">
          <LoadingSpinner />
        </div>
      }
      <div className="bg-white dark:bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
          Sign Up
        </h2>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleAuth} className="space-y-4 text-foreground">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <PasswordInput
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
          />
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="userType">User Type</Label>
            <Select value={userType} onValueChange={setUserType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select user type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="escort">Escort</SelectItem>
                <SelectItem value="bdsm">BDSM</SelectItem>
                <SelectItem value="couple">Couple</SelectItem>
                <SelectItem value="content creator">Content Creator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select value={gender} onValueChange={setGender} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="interest">Interest</Label>
            <Select value={interest} onValueChange={setInterest} required>
              <SelectTrigger>
                <SelectValue placeholder="Select your interest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
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
          <div>
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              min="18"
              max="200"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
          </div>
          {userType !== "general" && (
            <div>
              <Label htmlFor="ageProof">Age Proof</Label>
              <Dialog open={isAgeProofDialogOpen} onOpenChange={setIsAgeProofDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Upload Age Proof
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload Age Proof</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4">
                    <FileUploadHandler
                      fileNumber={1}
                      preview={ageProofPreview1}
                      handleFileChange={handleFileChange}
                      handleDeleteFile={handleDeleteFile}
                      uploaderRef={uploader1}
                    />
                    <FileUploadHandler
                      fileNumber={2}
                      preview={ageProofPreview2}
                      handleFileChange={handleFileChange}
                      handleDeleteFile={handleDeleteFile}
                      uploaderRef={uploader2}
                    />
                  </div>
                  <Button onClick={() => setIsAgeProofDialogOpen(false)} className="mt-4">Done</Button>
                </DialogContent>
              </Dialog>
              {(ageProofPreview1 || ageProofPreview2) && (
                <p className="text-xs text-muted-foreground mt-1">
                  {ageProofPreview1 && ageProofPreview2 ? "Both files uploaded" : "One file uploaded"}
                </p>
              )}
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
            />
            <Label htmlFor="terms" className="text-sm">
              I agree to the{' '}
              <Link href="/terms_and_conditions" className="text-blue-500">
                Terms & Conditions
              </Link>
            </Label>
          </div>

          <Button type="submit" className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-black">
            Sign Up
          </Button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-amber-400 hover:text-amber-300">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
