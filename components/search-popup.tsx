'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Send } from 'lucide-react'
import useDebounce from "@/hooks/use-debounce"

interface Escort {
  id: string
  name: string
  avatar: string
  location: string
  category: string
}

const topEscorts: Escort[] = [
  { id: '1', name: 'Lana', avatar: '/escort1.jpg', location: 'Sydney', category: 'Elite' },
  { id: '2', name: 'Mia', avatar: '/escort2.jpg', location: 'Melbourne', category: 'VIP' },
  { id: '3', name: 'Sophia', avatar: '/escort3.jpg', location: 'Brisbane', category: 'Luxury' },
]

export function SearchPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Escort[]>([])
  const router = useRouter()
  const debouncedQuery = useDebounce(searchQuery, 200)

  useEffect(() => {
    if (!debouncedQuery) {
      setSuggestions(topEscorts)
      return
    }

    const filteredEscorts = topEscorts.filter((escort) =>
      escort.name.toLowerCase().includes(debouncedQuery.toLowerCase())
    )
    setSuggestions(filteredEscorts)
  }, [debouncedQuery])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsOpen(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline">
        <Search className="mr-2 h-4 w-4" /> Search Escorts
      </Button>
      <AnimatePresence>
        {isOpen && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Find Your Perfect Escort</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Search by name, location, category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button onClick={handleSearch}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Top Escorts</h3>
                  {suggestions.map((escort) => (
                    <motion.div
                      key={escort.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => {
                        setSearchQuery(escort.name)
                        handleSearch()
                      }}
                    >
                      <img src={escort.avatar} alt={escort.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <span className="font-medium">{escort.name}</span>
                        <p className="text-xs text-gray-500">{escort.location} • {escort.category}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  )
}

