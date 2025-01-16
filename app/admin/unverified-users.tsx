'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Trash2, CheckCircle, Search, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface User {
  id: number
  username: string
  email: string
  documents: string[]
}

interface UnverifiedUsersProps {
  users: User[]
}

export function UnverifiedUsers({ users }: UnverifiedUsersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentDocuments, setCurrentDocuments] = useState<string[]>([])
  const [currentUserDetails, setCurrentUserDetails] = useState<{ username: string, email: string } | null>(null)

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleVerify = async (userId: number) => {
    setIsLoading(true)
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  const handleDelete = async (userId: number) => {
    setIsLoading(true)
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
  }

  const openUserDocuments = (user: User) => {
    setCurrentDocuments(user.documents)
    setCurrentUserDetails({ username: user.username, email: user.email })
    setIsDialogOpen(true)
  }

  return (
    <div>
      <div className="flex mb-4">
        <Input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mr-2"
        />
        <Button>
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </div>
      <div className="space-y-4">
        <AnimatePresence>
          {filteredUsers.map(user => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between p-4 bg-card rounded-lg mb-4 cursor-pointer border-gray-800 border-2 hover:bg-gray-900 transition-colors ease-in-out"
              onClick={() => openUserDocuments(user)}
            >
              <div>
                <h3 className="font-semibold">{user.username}</h3>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                  disabled={isLoading}
                  className="transition-transform duration-300 hover:scale-105"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleVerify(user.id)}
                  disabled={isLoading}
                  className="bg-green-500 hover:bg-green-600 transition-colors duration-300"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-gray-900 text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-amber-400">{currentUserDetails?.username}</DialogTitle>
              <DialogDescription>{currentUserDetails?.email}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {currentDocuments.map((doc, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={doc}
                    alt={`Document ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="destructive"
                onClick={() => {
                  handleDelete(filteredUsers.find(u => u.username === currentUserDetails?.username)?.id || 0)
                  setIsDialogOpen(false)
                }}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Delete'}
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  handleVerify(filteredUsers.find(u => u.username === currentUserDetails?.username)?.id || 0)
                  setIsDialogOpen(false)
                }}
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-600"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
