"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface RatingComponentProps {
  escortId: string
  initialRating?: number
}

export function RatingComponent({ escortId, initialRating }: RatingComponentProps) {
  const [rating, setRating] = useState(initialRating || 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const handleRating = async (selectedRating: number) => {
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

    const { data, error } = await supabase.from("ratings").upsert(
      {
        user_id: user.id,
        escort_id: escortId,
        rating: selectedRating,
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
      setRating(selectedRating)
      toast({
        title: "Success",
        description: "Your rating has been submitted.",
      })
    }
  }

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Button
          key={star}
          variant="ghost"
          size="sm"
          className="p-0 hover:bg-transparent"
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => handleRating(star)}
        >
          <Star
            className={`h-6 w-6 ${(hoveredRating || rating) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
              }`}
          />
        </Button>
      ))}
    </div>
  )
}
