'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [age, setAge] = useState('')
  const [userType, setUserType] = useState('')
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) alert(error.message)
      else router.push('/profile')
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            age: parseInt(age),
            type: userType,
          }
        }
      })
      if (error) alert(error.message)
      else {
        alert('Signup successful! Please check your email for verification.')
        setIsLogin(true)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-black via-gray-900 to-black">
      <div className="bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>
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
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
              <div>
                <Label htmlFor="userType">User Type</Label>
                <Select onValueChange={setUserType} required>
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
            </>
          )}
          <Button type="submit" className="w-full bg-gradient-to-r from-amber-400 to-amber-600 text-black">
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </form>
        <p className="mt-4 text-center">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-amber-400 hover:text-amber-300"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}

