'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ImageIcon, Settings, Clock, DollarSign, MessageSquare, Check, X } from 'lucide-react'

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
  testimonials
}: ProfileTabsProps) {
  return (
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
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pictures.map((picture) => (
            <Card key={picture.id} className="overflow-hidden">
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
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center gap-2 text-sm"
                >
                  <Check className="h-4 w-4 text-green-500" />
                  {service.service}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="rates">
        <div className="grid gap-4">
          {rates.map((rate) => (
            <Card key={rate.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">{rate.reason}</h3>
                    <p className="text-sm text-muted-foreground">
                      Duration: {rate.duration}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-lg">
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
            <Card key={testimonial.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 relative rounded-full overflow-hidden">
                    <Image
                      src={testimonial.users?.profile_picture || '/placeholder.svg?height=100&width=100'}
                      alt={testimonial.users?.name || 'Anonymous'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {testimonial.users?.name || 'Anonymous'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(testimonial.created_at).toLocaleDateString()}
                    </p>
                    <p className="mt-2">{testimonial.comments}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}

