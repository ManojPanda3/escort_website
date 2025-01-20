'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Plus, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'


interface PricingPackage {
  type: string
  id: number | null
  price: number
  billing_cycle: string
  features: string[]
  max_media: number
  max_places: number
}

// interface PricingPackagesProps {
//   packages: PricingPackage[]
// }

export function PricingPackages({ offers }) {
  const [packages, setPackages] = useState<PricingPackage[]>(offers)
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    const { data, error } = await fetch("/api/offer", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    if (error) {
      console.error('Error fetching packages:', error)
    }
    if (data) {
      setPackages(data)
    }
  }

  const handleEditPackage = (pkg: PricingPackage) => {
    setEditingPackage({ ...pkg })
    setIsDialogOpen(true)
  }

  const handleSavePackage = async () => {
    if (editingPackage) {
      if (editingPackage.id) {
        // Update existing package
        let data = { ...editingPackage }
        delete data.id
        console.log(data)
        const offerUpdateResponse = await fetch("/api/offer", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!offerUpdateResponse.ok) alert("Failed to update offer: " + offerUpdateResponse.statusText)
        const { error } = await offerUpdateResponse.json()
        if (error) console.error('Error updating package:', error)
      } else {
        // Add new package

        const offerInsertResponse = await fetch("/api/offer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingPackage),
        });
        if (!offerInsertResponse.ok) alert("Failed to update offer: " + offerInsertResponse.statusText)
        const { error } = await offerInsertResponse.json()
        if (error) console.error('Error adding package:', error)
      }
      fetchPackages()
      setIsDialogOpen(false)
    }
  }

  const handleAddFeature = () => {
    if (editingPackage) {
      setEditingPackage({
        ...editingPackage,
        features: [...editingPackage.features, '']
      })
    }
  }

  const handleUpdateFeature = (index: number, value: string) => {
    if (editingPackage) {
      const newFeatures = [...editingPackage.features]
      newFeatures[index] = value
      setEditingPackage({
        ...editingPackage,
        features: newFeatures
      })
    }
  }

  const handleRemoveFeature = (index: number) => {
    if (editingPackage) {
      setEditingPackage({
        ...editingPackage,
        features: editingPackage.features.filter((_, i) => i !== index)
      })
    }
  }

  const handleAddPackage = () => {
    setEditingPackage({
      id: null,
      type: "",
      price: 1,
      billing_cycle: 'monthly',
      features: [],
      max_media: 1,
      max_places: 1
    })
    setIsDialogOpen(true)
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAddPackage}>
          <Plus className="mr-2 h-4 w-4" /> Add Package
        </Button>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {packages.map((pkg, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            key={pkg.id}
          >
            <Card key={pkg.id} className="bg-card border-primary">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">{pkg.type}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold">${pkg.price}</span>
                  <span className="text-muted-foreground">/{pkg.billing_cycle}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-4">
                  {pkg.features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center"
                    >
                      <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      {feature}
                    </motion.li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground mb-4">Max Media: {pkg.max_media}</p>
                <p className="text-sm text-muted-foreground mb-4">Max Places: {pkg.max_places}</p>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  onClick={() => handleEditPackage(pkg)}
                >
                  <Edit className="mr-2 h-4 w-4" /> Edit Package
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingPackage?.id ? 'Edit' : 'Add'} Package</DialogTitle>
          </DialogHeader>
          {editingPackage && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Input
                  id="type"
                  value={editingPackage.type}
                  onChange={(e) => setEditingPackage({ ...editingPackage, type: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Price
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={editingPackage.price}
                  min={1}
                  onChange={(e) => setEditingPackage({ ...editingPackage, price: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="billingCycle" className="text-right">
                  Billing Cycle
                </Label>
                <Select value={editingPackage.billing_cycle} onValueChange={(e) => setEditingPackage({ ...editingPackage, billing_cycle: e })} >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Billing Cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">monthly</SelectItem>
                    <SelectItem value="yearly">yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maxMedia" className="text-right">
                  Max Media
                </Label>
                <Input
                  id="maxMedia"
                  min={1}
                  type="number"
                  value={editingPackage.max_media}
                  onChange={(e) => setEditingPackage({ ...editingPackage, max_media: parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maxPlaces" className="text-right">
                  Max Places
                </Label>
                <Input
                  id="maxPlaces"
                  type="number"
                  min={1}
                  value={editingPackage.max_places}
                  onChange={(e) => setEditingPackage({ ...editingPackage, max_places: parseInt(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid gap-2">
                <Label>Features</Label>
                {editingPackage.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => handleUpdateFeature(index, e.target.value)}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveFeature(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button onClick={handleAddFeature} variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Add Feature
                </Button>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePackage}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
