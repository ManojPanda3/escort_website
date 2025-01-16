'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Plus, Trash2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface PricingPackage {
  id: number
  name: string
  amount: number
  billingCycle: string
  features: string[]
}

interface PricingPackagesProps {
  packages: PricingPackage[]
}

export function PricingPackages({ packages: initialPackages }: PricingPackagesProps) {
  const [packages, setPackages] = useState(initialPackages)
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleEditPackage = (pkg: PricingPackage) => {
    setEditingPackage({ ...pkg })
    setIsDialogOpen(true)
  }

  const handleSavePackage = () => {
    if (editingPackage) {
      setPackages(packages.map(p => p.id === editingPackage.id ? editingPackage : p))
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

  return (
    <>
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
                <CardTitle className="text-2xl font-bold text-primary">{pkg.name}</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold">${pkg.amount}</span>
                  <span className="text-muted-foreground">/{pkg.billingCycle}</span>
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
            <DialogTitle>Edit Package</DialogTitle>
          </DialogHeader>
          {editingPackage && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editingPackage.name}
                  onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
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
                  value={editingPackage.amount}
                  onChange={(e) => setEditingPackage({ ...editingPackage, amount: parseFloat(e.target.value) })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="billingCycle" className="text-right">
                  Billing Cycle
                </Label>
                <Input
                  id="billingCycle"
                  value={editingPackage.billingCycle}
                  onChange={(e) => setEditingPackage({ ...editingPackage, billingCycle: e.target.value })}
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
              Discard
            </Button>
            <Button onClick={handleSavePackage}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
