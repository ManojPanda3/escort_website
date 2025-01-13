'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams, notFound } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Eye, EyeOff } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Success } from "@/components/ui/success"

export default function AuthPage() {
  const { action } = useParams() as { action: 'login' | 'signup' }
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [userType, setUserType] = useState('general')
  const [ageProofFile, setAgeProofFile] = useState<File | null>(null)
  const [age, setAge] = useState<string>('')
  const [isLogin, setIsLogin] = useState(action !== "signup")
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.push('/profile')
      }
    }
    checkSession()
  }, [router, supabase])

  if (action !== "login" && action !== "signup") {
    notFound()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB')
        return
      }
      setAgeProofFile(file)
      setError('')
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address')
      setSuccess('')
      return
    }

    try {
      const response = await fetch('/api/auth/resetPassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()
      if (response.ok) {
        setSuccess('Password reset email sent! Please check your inbox.')
        setError('')
      } else {
        setError(data.error || 'Failed to send reset email')
        setSuccess('')
      }
    } catch (err) {
      setError('Failed to connect to server')
    }
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (isLogin) {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) setError(error.message)
        else router.push('/')
      } catch (err) {
        setError('Failed to login')
      }
      return
    }

    if (!agreeToTerms) {
      setError('You must agree to the terms and conditions')
      return
    }

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)
      formData.append('username', username)
      formData.append('userType', userType)
      formData.append('age', age)
      
      if (userType !== "general" && ageProofFile) {
        formData.append('ageProof', ageProofFile)
      }

      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        router.push('/auth/login')
      } else {
        setError(data.message || 'An error occurred during signup')
      }
    } catch (err) {
      setError('Failed to connect to server')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black">
      <div className="bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Success className="mb-4">
            {success}
          </Success>
        )}
        <form onSubmit={handleAuth} className="space-y-4">
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
          <div className="relative">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-2 flex items-center top-1/3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {!isLogin && (
            <>
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
                    <SelectItem value="BDSM">BDSM</SelectItem>
                    <SelectItem value="Couple">Couple</SelectItem>
                    <SelectItem value="content creator">Content Creator</SelectItem>
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
              {userType !== "general" &&
                <div>
                  <Label htmlFor="ageProof">Age Proof (Image file)</Label>
                  <Input
                    id="ageProof"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Please upload an image file (max 5MB) for age verification.
                  </p>
                </div>
              }
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm">
                  I agree to the{' '}
                  <Link href="/terms_and_conditions" className="text-blue-500">
                    Terms & Conditions
                  </Link>
                </label>
              </div>
            </>
          )}

          <Button type="submit" className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-black">
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>

        </form>
        <p className="mt-4 text-center">
          {isLogin && (
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-amber-400 hover:text-amber-300"
            >
              Forgot Password?
            </button>
          )}
          <br />
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <Link
            href={`/auth/${isLogin ? 'signup' : 'login'}`}
            className="text-amber-400 hover:text-amber-300"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </Link>
        </p>
      </div>
    </div>
  )
}
