"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Check, Settings, DollarSign, MessageSquare, UserIcon, CheckIcon, CheckCircleIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { StoryCircle } from "./story-circle"

interface Escort {
  id: string
  username: string
  age: number
  location_name: string
  profile_picture: string
  cover_image: string
  bio: string
}

interface Picture {
  picture: string
  title: string
  created_at: string
}

interface Story {
  id: string
  url: string
  created_at: string
  title: string
  isvideo: boolean
}

interface Service {
  id: string
  service: string
  owner: string
}

interface Rate {
  id: string
  reason: string
  duration: string
  price: number
  outcall: boolean
  owner: string
}

interface Testimonial {
  id: string
  comment: string
  created_at: string
  users: {
    name: string
    profile_picture: string
  } | null
  owner: string
}

interface SwipeInterfaceProps {
  escorts: Escort[]
}

export function SwipeInterface({ escorts }: SwipeInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<"left" | "right" | null>(null)
  const { toast } = useToast()
  const supabase = createClientComponentClient()
  const dragX = useMotionValue(0)
  const dragY = useMotionValue(0)
  const dragRotate = useTransform(dragX, [-200, 200], [-30, 30])
  const dragOpacity = useTransform(dragX, [-200, 0, 200], [0.5, 1, 0.5])
  const leftIconOpacity = useTransform(dragX, [-200, -100, 0], [1, 0.5, 0])
  const rightIconOpacity = useTransform(dragX, [0, 100, 200], [0, 0.5, 1])
  const [isDragging, setIsDragging] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [dragDirection, setDragDirection] = useState<"x" | "y" | null>(null)
  const [pictures, setPictures] = useState<Picture[]>([])
  const [stories, setStories] = useState<Story[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [rates, setRates] = useState<Rate[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])

  const currentEscort = escorts[currentIndex]

  useEffect(() => {
    // Prevent body scroll when expanded
    if (isExpanded) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isExpanded])

  useEffect(() => {
    if (isExpanded && currentEscort) {
      const fetchData = async () => {
        const [picturesRes, storiesRes, servicesRes, ratesRes, testimonialsRes] = await Promise.all([
          supabase.from("pictures").select("picture,title,created_at").eq("owner", currentEscort.id),
          supabase.from("story").select("*").eq("owner", currentEscort.id),
          supabase.from("services").select("*").eq("owner", currentEscort.id),
          supabase.from("rates").select("*").eq("owner", currentEscort.id),
          supabase.from("testimonials").select("*, users(name, profile_picture)").eq("owner", currentEscort.id),
        ])

        if (!picturesRes.error && picturesRes.data) setPictures(picturesRes.data)
        if (!storiesRes.error && storiesRes.data) setStories(storiesRes.data)
        if (!servicesRes.error && servicesRes.data) setServices(servicesRes.data)
        if (!ratesRes.error && ratesRes.data) setRates(ratesRes.data)
        if (!testimonialsRes.error && testimonialsRes.data) setTestimonials(testimonialsRes.data)
      }

      fetchData()
    }
  }, [isExpanded, currentEscort, supabase])

  const handleDragStart = (event: any, info: any) => {
    setIsDragging(true)
    const xOffset = Math.abs(info.offset.x)
    const yOffset = Math.abs(info.offset.y)

    if (!dragDirection) {
      if (xOffset > yOffset) {
        setDragDirection("x")
      } else if (yOffset > xOffset) {
        setDragDirection("y")
      }
    }
  }

  const handleDrag = (event: any, info: any) => {
    if (dragDirection === "x") {
      dragY.set(0)
    } else if (dragDirection === "y") {
      dragX.set(0)
    }
  }

  const handleDragEnd = async () => {
    const x = dragX.get()
    const y = dragY.get()

    if (dragDirection === "y" && y < -50) {
      setIsExpanded(true)
    } else if (dragDirection === "x" && Math.abs(x) > 50) {
      setDirection(x < 0 ? "left" : "right")

      if (x > 100) {
        // Swiped right
        fetch(`/api/profile/rating`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            escortId: currentEscort.id,
            rating: 1,
          }),
        }).catch((error) => {
          console.error("Failed to submit rating:", error)
        })
      }

      setTimeout(() => {
        setDirection(null)
        setCurrentIndex((prevIndex) => (prevIndex + 1) % escorts.length)
      }, 300)
    }

    dragX.set(0)
    dragY.set(0)
    setIsDragging(false)
    setDragDirection(null)
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
        rating,
      },
      {
        onConflict: "user_id,escort_id",
      },
    )

    toast({
      title: error ? "Error" : "Success",
      description: error ? "Failed to submit rating. Please try again." : "Your rating has been submitted.",
      variant: error ? "destructive" : "default",
    })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden">
      <h1 className="text-3xl font-bold mb-8 text-primary">Rate Escorts</h1>
      <AnimatePresence mode="wait">
        {currentEscort && (
          <>
            <div className="relative">
              <motion.div
                style={{ opacity: leftIconOpacity }}
                className="absolute left-[-100px] top-0 -translate-y-1/2 z-10"
              >
                <X className="h-24 w-24 text-red-500" />
              </motion.div>
              <motion.div
                style={{ opacity: rightIconOpacity }}
                className="absolute right-[-100px] top-0 -translate-y-1/2 z-10"
              >
                <Check className="h-24 w-24 text-green-500" />
              </motion.div>
              <motion.div
                key={currentEscort.id}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  width: isExpanded ? "92vw" : "20rem",
                  height: isExpanded ? "12rem" : "28rem",
                }}
                exit={{
                  scale: 0.8,
                  opacity: 0,
                  x: direction === "left" ? -200 : direction === "right" ? 200 : 0,
                }}
                style={{
                  x: dragX,
                  y: dragY,
                  rotate: !isExpanded ? dragRotate : 0,
                  opacity: !isExpanded ? dragOpacity : 1,
                  cursor: isDragging ? "grabbing" : "grab",
                }}
                drag={!isExpanded}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.7}
                dragMomentum={false}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
                transition={{ duration: 0.2 }}
              >
                <Card className="w-full h-full overflow-hidden">
                  <div className="relative h-full">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={isExpanded ? "expanded" : "normal"}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                      >
                        {isExpanded ? (
                          <div className="flex items-center gap-4 relative h-full bg-gray-400 outline outline-1 outline-white rounded-sm">
                            <div className="h-full w-full relative rounded-sm overflow-hidden">
                              <Image
                                src={currentEscort.cover_image || "/placeholder.svg"}
                                alt={currentEscort.username}
                                fill
                                className="object-cover"
                                priority
                              />
                            </div>
                            <motion.div
                              className="space-y-2 w-20 absolute top-2 left-2 h-full"
                              initial={{ scale: 1 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 1 }}
                            >
                              <div className="flex items-center relative gap-4">
                                <div className="h-20 w-20 relative rounded-full overflow-hidden border-2 bg-gray-700">
                                  <Image
                                    src={currentEscort.profile_picture || "/placeholder.svg"}
                                    alt={currentEscort.username}
                                    fill
                                    className="object-cover"
                                    priority
                                  />
                                </div>
                              </div>
                            </motion.div>
                            <Button
                              className="absolute top-2 right-2 rounded-full p-2 hover:bg-transparent hover:text-red-400"
                              variant="ghost"
                              onClick={() => setIsExpanded(false)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Image
                              src={currentEscort.profile_picture || "/placeholder.svg"}
                              alt={currentEscort.username}
                              fill
                              className="object-cover"
                              priority
                            />
                            <div className="absolute h-full w-full bg-black opacity-0"></div>
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white">
                              <h2 className="text-2xl font-bold">
                                {currentEscort.username}, {currentEscort.age}
                              </h2>
                              <p className="text-sm">{currentEscort.location_name}</p>
                              <p className="text-sm mt-2">{currentEscort.bio}</p>
                            </div>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: 1 }}
                  exit={{ scaleY: 0, opacity: 0 }}
                  className="fixed inset-0 top-[12rem] bg-white dark:bg-gray-900 p-6 overflow-y-auto"
                  style={{ zIndex: 50 }}
                >
                  <div className="max-w-4xl mx-auto space-y-8">
                    <Suspense fallback={<div>Loading stories...</div>}>
                      <div className="flex gap-4 pb-2 overflow-x-auto">
                        {stories.map((story, index) => (
                          <StoryCircle
                            id={story.id}
                            key={story.id}
                            title={story.title}
                            url={story.url}
                            isVideo={story.isvideo}
                            avatar_image={currentEscort.profile_picture}
                          />
                        ))}
                      </div>
                    </Suspense>

                    {/* Basic Info Section */}
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary" className="px-3 py-1">
                          Available Now
                        </Badge>
                        <Badge variant="outline" className="px-3 py-1">
                          <UserIcon className="w-4 h-4 mr-2" />
                          {currentEscort.age} years
                        </Badge>
                        {services.slice(0, 3).map((service) => (
                          <Badge key={service.id} variant="outline" className="px-3 py-1">
                            <CheckIcon className="w-4 h-4 mr-2" />
                            {service.service}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Looking For Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">I'm looking for</h3>
                      <div className="space-y-2">
                        {["Casual Dating", "Short-term", "Long-term"].map((item, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircleIcon className="w-5 h-5 text-primary" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interests Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">My interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {["Fashion", "Travel", "Food", "Music", "Art", "Sports"].map((interest, index) => (
                          <div
                            key={index}
                            className="px-3 py-1 bg-muted rounded-full text-sm flex items-center gap-2"
                          >
                            <span>🎯</span> {interest}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Gallery Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Gallery</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {pictures.slice(0, 6).map((pic, index) => (
                          <div key={index} className="aspect-square relative rounded-lg overflow-hidden">
                            <Image
                              src={pic.picture || "/placeholder.svg"}
                              alt={pic.title}
                              fill
                              className="object-cover hover:scale-110 transition-transform"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rates Section */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">Rates</h3>
                      <div className="grid gap-3">
                        {rates.map((rate) => (
                          <Card key={rate.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                <div>
                                  <h3 className="font-semibold">{rate.reason}</h3>
                                  <p className="text-sm text-muted-foreground">Duration: {rate.duration}</p>
                                </div>
                                <Badge variant="secondary" className="text-lg self-start sm:self-center">
                                  $ {rate.price}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                  {rate.outcall ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                  ) : (
                                    <X className="h-4 w-4 text-red-500" />
                                  )}
                                  Outcall Available
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}