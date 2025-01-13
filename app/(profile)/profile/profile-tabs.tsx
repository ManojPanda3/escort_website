"use client"
import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ImageIcon, Settings, DollarSign, MessageSquare, Plus, Check, X } from 'lucide-react'
import { AddServiceModal } from '@/components/modals/add-service-modal'
import { AddPictureModal } from '@/components/modals/add-picture-modal'
import { AddRateModal } from '@/components/modals/add-rate-modal'
import { AddStoryModal } from '@/components/modals/add-story-modal'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import Image from 'next/image'

interface ProfileTabsProps {
  pictures: any[]
  services: any[]
  rates: any[]
  testimonials: any[]
}

export function ProfileTabs({
  pictures,
  services,
  rates,
  testimonials,
}: ProfileTabsProps) {
  const [activeModal, setActiveModal] = useState<'service' | 'picture' | 'rate' | 'story' | null>(null)
  const { toast } = useToast()
  console.clear()
  console.log(
  pictures,
  services,
  rates,
  testimonials,
  )

  return (
    <>
      <Tabs defaultValue="pictures" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pictures" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Pictures
          </TabsTrigger>
          <TabsTrigger value="services" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="rates" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Rates
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Testimonials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pictures">
          <Button
            variant="outline"
            onClick={() => setActiveModal('picture')}
            className="mb-4 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Picture
          </Button>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pictures.map((picture) => (
              <Card key={picture.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square relative">
                  <Image
                    src={picture.picture || '/placeholder.svg?height=400&width=400'}
                    alt={picture.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <p className="font-medium truncate">{picture.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {picture.likes} likes
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="services">
          <Button
            variant="outline"
            onClick={() => setActiveModal('service')}
            className="mb-4 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center gap-2 text-sm p-3 border rounded-md hover:border-primary transition-colors"
                  >
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="truncate">{service.service}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates">
          <Button
            variant="outline"
            onClick={() => setActiveModal('rate')}
            className="mb-4 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Rate
          </Button>
          <div className="grid gap-4">
            {rates.map((rate) => (
              <Card key={rate.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                    <div>
                      <h3 className="font-semibold">{rate.reason}</h3>
                      <p className="text-sm text-muted-foreground">
                        Duration: {rate.duration}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-lg self-start sm:self-center">
                      {rate.price}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {rate.outcall ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                    Outcall Available
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="testimonials">
          <div className="grid gap-4">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 relative rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={testimonial.users?.profile_picture || '/placeholder.svg'}
                        alt={testimonial.users?.name || 'Anonymous'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold truncate">
                        {testimonial.users?.name || 'Anonymous'}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(testimonial.created_at).toLocaleDateString()}
                      </p>
                      <p className="mt-2 break-words">{testimonial.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <AddServiceModal
        isOpen={activeModal === 'service'}
        onClose={() => {
          setActiveModal(null)
          toast({
            title: "Success",
            description: "Service added successfully",
          })
        }}
      />
      <AddPictureModal
        isOpen={activeModal === 'picture'}
        onClose={() => {
          setActiveModal(null)
          toast({
            title: "Success", 
            description: "Picture uploaded successfully",
          })
        }}
      />
      <AddRateModal
        isOpen={activeModal === 'rate'}
        onClose={() => {
          setActiveModal(null)
          toast({
            title: "Success",
            description: "Rate added successfully",
          })
        }}
      />
      <AddStoryModal
        isOpen={activeModal === 'story'}
        onClose={() => {
          setActiveModal(null)
          toast({
            title: "Success",
            description: "Story added successfully",
          })
        }}
      />
      <Toaster />
    </>
  )
}
