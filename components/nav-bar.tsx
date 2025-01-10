'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, Search, User } from 'lucide-react'
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

export function NavBar() {
  const [user, setUser] = useState(null)
  const router = useRouter()
  const supabase = createClientComponentClient()

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
    <nav className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border">
      {/* Top Cities Bar */}
      <div className="hidden lg:flex items-center justify-center gap-4 p-2 text-xs border-b border-border">
        {cities.map((city) => (
          <Link
            key={city}
            href="#"
            className="hover:text-primary transition-colors"
          >
            {city}
          </Link>
        ))}
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
              <span className="hidden sm:inline">ALL-NIGHTER</span>
              <span className="sm:hidden">A-N</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {mainNav.map((item) => (
              <Link
                key={item}
                href="#"
                className="text-sm hover:text-primary transition-colors"
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
            >
              PREMIUM
            </Link>

            <ThemeToggle />
            {/* Search */}
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex">
              <Search className="h-5 w-5" />
            </Button>

            {/* User */}
            {user ? (
              <Button variant="ghost" size="icon" onClick={() => router.push('/profile')}>
                {user.user_metadata.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            ) : (
              <Button className="bg-primary hover:bg-primary/80 font-bold py-2 px-4 rounded-full transition duration-300 text-black" onClick={() => router.push('/auth/login')}>
                <User className="h-5 w-5 mr-2" />
                Login
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                <div className="mt-4 space-y-4">
                  {mainNav.map((item) => (
                    <Link
                      key={item}
                      href="#"
                      className="block py-2 hover:text-primary transition-colors"
                    >
                      {item}
                    </Link>
                  ))}
                  <Link
                    href="/premium"
                    className="block py-2 text-sm font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                  >
                    PREMIUM
                  </Link>
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Popular Cities</p>
                    <div className="grid grid-cols-2 gap-2">
                      {cities.slice(0, 6).map((city) => (
                        <Link
                          key={city}
                          href="#"
                          className="text-sm hover:text-primary transition-colors"
                        >
                          {city}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

