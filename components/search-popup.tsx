'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from 'lucide-react'

interface User {
  id: string
  username: string
  avatar: string
}

export function SearchPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<User[]>([])
  const router = useRouter()

  useEffect(() => {
    // Simulating fetching top users
    const topUsers: User[] = [
      { id: '1', username: 'user1', avatar: '/placeholder.svg' },
      { id: '2', username: 'user2', avatar: '/placeholder.svg' },
      { id: '3', username: 'user3', avatar: '/placeholder.svg' },
    ]
    setSuggestions(topUsers)
  }, [])

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsOpen(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="outline">
        <Search className="mr-2 h-4 w-4" /> Search
      </Button>
      <AnimatePresence>
        {isOpen && (
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                  />
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
                    >
                      <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
                      <span>{user.username}</span>
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
