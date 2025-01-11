'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

interface AddRateModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddRateModal({ isOpen, onClose }: AddRateModalProps) {
  const [loading, setLoading] = useState(false)
  const [reason, setReason] = useState('')
  const [price, setPrice] = useState('')
  const [duration, setDuration] = useState('')
  const [outcall, setOutcall] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/profile/addRate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason,
          price,
          duration,
          outcall,
        }),
      })

      if (!response.ok) throw new Error('Failed to add rate')

      router.refresh()
      onClose()
    } catch (error) {
      console.error('Error adding rate:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Rate</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="reason">Reason</Label>
            <Input
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="duration">Duration</Label>
            <Input
              id="duration"
              type="time"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="outcall"
              checked={outcall}
              onCheckedChange={(checked) => setOutcall(checked as boolean)}
            />
            <Label htmlFor="outcall">Outcall Available</Label>
          </div>
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Add Rate
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

