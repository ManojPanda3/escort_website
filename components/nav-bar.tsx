'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

export function NavBar() {
  const [isDiscreet, setIsDiscreet] = useState(false)
  
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
    <nav className="bg-black text-white">
      {/* Top Cities Bar */}
      <div className="hidden md:flex items-center justify-center gap-4 p-2 text-xs border-b border-gray-800">
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
          <Link href="/" className="text-xl font-bold text-primary">
            ALL-NIGHTER
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
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
          <div className="flex items-center gap-4">
            {/* Discreet Mode */}
            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs">DISCREET MODE</span>
              <Switch
                checked={isDiscreet}
                onCheckedChange={setIsDiscreet}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            {/* Premium Subscription */}
            <Link
              href="/premium"
              className="hidden md:block text-sm font-semibold bg-gradient-to-r from-amber-400 to-amber-600 text-black px-4 py-2 rounded-full animate-pulse hover:animate-none transition-all duration-300 hover:from-amber-500 hover:to-amber-700"
            >
              PREMIUM
            </Link>

            {/* Search */}
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>

            {/* User */}
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>

            {/* Mobile Menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

