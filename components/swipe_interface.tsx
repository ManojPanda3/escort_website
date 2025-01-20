"use client"

import { useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Heart, Star } from "lucide-react"

interface Escort {
  id: string
  username: string
  age: number
  location_name: string
  profile_picture: string
  bio: string
}

interface SwipeInterfaceProps {
  escorts: Escort[]
}

export function SwipeInterface({ escorts }: SwipeInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const currentEscort = escorts[currentIndex]

  const handleSwipe = async (swipeDirection: "left" | "right") => {
    setDirection(swipeDirection)

    if (swipeDirection === "right") {
      const rating = 5 // You can adjust this based on your rating system
      await rateEscort(currentEscort.id, rating)
    }

    setTimeout(() => {
      setDirection(null)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % escorts.length)
    }, 300)
  }

  const rateEscort = async (escortId: string, rating: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to rate an escort.",
        variant: "destructive",
      })
      return
    }

    const { error } = await supabase.from("ratings").upsert(
      {
        user_id: user.id,
        escort_id: escortId,
        rating: rating,
      },
      {
        onConflict: "user_id,escort_id",
      },
    )

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit rating. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Your rating has been submitted.",
      })
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-8 text-primary">Rate Escorts</h1>
      <AnimatePresence >
        {currentEscort && (
          <motion.div
            key={currentEscort.id}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{
              scale: 0.8,
              opacity: 0,
              x: direction === "left" ? -300 : direction === "right" ? 300 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <Card className="w-80 h-[28rem] overflow-hidden">
              <div className="relative h-full">
                <Image
                  src={currentEscort.profile_picture || "/placeholder.svg"}
                  alt={currentEscort.username}
                  layout="fill"
                  objectFit="cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white">
                  <h2 className="text-2xl font-bold">
                    {currentEscort.username}, {currentEscort.age}
                  </h2>
                  <p className="text-sm">{currentEscort.location_name}</p>
                  <p className="text-sm mt-2">{currentEscort.bio}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex justify-center mt-8 space-x-4">
        <Button size="lg" variant="outline" className="rounded-full p-4" onClick={() => handleSwipe("left")}>
          <X className="h-8 w-8 text-red-500" />
        </Button>
        <Button size="lg" variant="outline" className="rounded-full p-4" onClick={() => handleSwipe("right")}>
          <Heart className="h-8 w-8 text-green-500" />
        </Button>
      </div>
    </div>
  )
}
