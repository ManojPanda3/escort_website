'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LogOut, Menu, Search, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface User {
  id: string
  username: string
  avatar: string
}

export function NavBar() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchType, setSearchType] = useState('all')
  const [suggestions, setSuggestions] = useState<User[]>([])

  // Pre-fetch suggestions on mount
  useEffect(() => {
    const fetchSuggestions = async () => {
      // Replace with actual API call
      const topUsers: User[] = [
        { id: '1', username: 'user1', avatar: '/placeholder.svg' },
        { id: '2', username: 'user2', avatar: '/placeholder.svg' },
        { id: '3', username: 'user3', avatar: '/placeholder.svg' },
      ]
      setSuggestions(topUsers)
    }
    fetchSuggestions()
  }, [])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`)
      setIsSearchOpen(false)
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase.auth])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const cities = [
    'INTERNATIONAL',
    'AUSTRALIA', 
    'SYDNEY',
    'MELBOURNE',
    'BRISBANE',
    'GOLD COAST',
    'SUNSHINE COAST',
    'PERTH',
    'ADELAIDE',
    'CANBERRA',
    'HOBART',
    'DARWIN'
  ]

  const mainNav = [
    'LOCATIONS',
    'ESCORTS',
    'BDSM',
    'COUPLES', 
    'CATEGORIES'
  ]

  return (
    <nav className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border" role="navigation" aria-label="Main navigation">
      {/* Top Cities Bar */}
      <div className="hidden lg:flex items-center justify-center gap-4 p-2 text-xs border-b border-border" role="navigation" aria-label="City navigation">
        {cities.map((city) => (
          <Link
            key={city}
            href={`/location/${city.toLowerCase()}`}
            className="hover:text-primary transition-colors"
            aria-label={`View escorts in ${city}`}
          >
            {city}
          </Link>
        ))}
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" aria-label="Go to homepage">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
              <span className="hidden sm:inline">ALL-NIGHTER</span>
              <span className="sm:hidden">A-N</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6" role="navigation" aria-label="Primary navigation">
            {mainNav.map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-sm hover:text-primary transition-colors"
                aria-label={`View ${item.toLowerCase()}`}
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Premium Button */}
            <Link
              href="/premium"
              className="hidden sm:block text-sm font-semibold bg-gradient-to-r from-amber-400 to-amber-600 text-black px-4 py-2 rounded-full animate-pulse hover:animate-none transition-all duration-300 hover:from-amber-500 hover:to-amber-700"
              aria-label="Upgrade to premium"
            >
              PREMIUM
            </Link>

            <ThemeToggle />
            
            {/* Search */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="hidden sm:inline-flex" 
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* User */}
            {user ? (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => router.push('/profile')}
                aria-label="View profile"
              >
                {user.user_metadata?.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="Profile picture"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            ) : (
              <LoginBtn />
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-4 space-y-4">
                  {mainNav.map((item) => (
                    <Link
                      key={item}
                      href={`/${item.toLowerCase()}`}
                      className="block py-2 hover:text-primary transition-colors"
                      aria-label={`View ${item.toLowerCase()}`}
                    >
                      {item}
                    </Link>
                  ))}
                  <Link
                    href="/premium"
                    className="block py-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                    aria-label="Upgrade to premium"
                  >
                    PREMIUM
                  </Link>
                  {user ? (
                    <button
                      className="block py-2 text-sm font-semibold text-red-600 hover:text-red-300 transition-colors"
                      onClick={handleLogout}
                      aria-label="Log out"
                    >
                      <LogOut />
                    </button>
                  ) : (
                    <LoginBtn className="rounded-sm" />
                  )}
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Popular Cities</p>
                    <div className="grid grid-cols-2 gap-2">
                      {cities.slice(0, 6).map((city) => (
                        <Link
                          key={city}
                          href={`/location/${city.toLowerCase()}`}
                          className="text-sm hover:text-primary transition-colors"
                          aria-label={`View escorts in ${city}`}
                        >
                          {city}
                        </Link>
                      ))}
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Search Popup */}
      <AnimatePresence>
        {isSearchOpen && (
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Search</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search query"
                  />
                  <Select value={searchType} onValueChange={setSearchType}>
                    <SelectTrigger className="w-[180px]" aria-label="Search type">
                      <SelectValue placeholder="Search type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="escort">Escort</SelectItem>
                      <SelectItem value="bdsm">BDSM</SelectItem>
                      <SelectItem value="couples">Couples</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleSearch}>Search</Button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Top Users</h3>
                  {suggestions.map((user) => (
                    <motion.div
                      key={user.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => {
                        setSearchQuery(user.username)
                        handleSearch()
                      }}
                      role="button"
                      aria-label={`Search for ${user.username}`}
                    >
                      <Image src={user.avatar} alt={`${user.username}'s avatar`} width={32} height={32} className="rounded-full" />
                      <span>{user.username}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </nav>
  )
}

const LoginBtn = ({ className }: { className?: string }) => {
  const router = useRouter()
  return (
    <Button 
      className={"bg-primary hover:bg-primary/80 font-bold py-2 px-4 rounded-full transition duration-300 text-black " + className} 
      onClick={() => router?.push('/auth/login')}
      aria-label="Log in"
    >
      <User className="h-5 w-5 mr-2" />
      Login
    </Button>
  );
}
