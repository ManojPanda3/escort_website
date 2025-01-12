'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ImageIcon, Settings, Clock, DollarSign, MessageSquare, Plus } from 'lucide-react'
import { AddServiceModal } from '@/components/modals/add-service-modal'
import { AddPictureModal } from '@/components/modals/add-picture-modal'
import { AddRateModal } from '@/components/modals/add-rate-modal'
import { AddStoryModal } from '@/components/modals/add-story-modal'

interface ProfileTabsProps {
  pictures: any[]
  services: any[]
  rates: any[]
  testimonials: any[]
  isOwnProfile: boolean
}

export function ProfileTabs({
  pictures,
  services,
  rates,
  testimonials,
  isOwnProfile
}: ProfileTabsProps) {
  const [activeModal, setActiveModal] = useState<'service' | 'picture' | 'rate' | 'story' | null>(null)

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
          {isOwnProfile && (
            <Button 
              variant="outline" 
              onClick={() => setActiveModal('picture')}
              className="mb-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Picture
            </Button>
          )}
          {/* Pictures grid */}
        </TabsContent>

        <TabsContent value="services">
          {isOwnProfile && (
            <Button 
              variant="outline" 
              onClick={() => setActiveModal('service')}
              className="mb-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          )}
          {/* Services list */}
        </TabsContent>

        <TabsContent value="rates">
          {isOwnProfile && (
            <Button 
              variant="outline" 
              onClick={() => setActiveModal('rate')}
              className="mb-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Rate
            </Button>
          )}
          {/* Rates list */}
        </TabsContent>

        <TabsContent value="testimonials">
          {/* Testimonials list */}
        </TabsContent>
      </Tabs>

      <AddServiceModal 
        isOpen={activeModal === 'service'} 
        onClose={() => setActiveModal(null)} 
      />
      <AddPictureModal 
        isOpen={activeModal === 'picture'} 
        onClose={() => setActiveModal(null)} 
      />
      <AddRateModal 
        isOpen={activeModal === 'rate'} 
        onClose={() => setActiveModal(null)} 
      />
      <AddStoryModal 
        isOpen={activeModal === 'story'} 
        onClose={() => setActiveModal(null)} 
      />
    </>
  )
}

