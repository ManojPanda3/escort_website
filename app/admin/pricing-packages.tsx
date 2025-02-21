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
import { Checkbox } from '@/components/ui/checkbox';


interface PricingPackage {
  type: string
  id: number | null
  price: number
  billing_cycle: string
  features: string[]
  max_media: number | null;
  max_places: number | null;
  isvip_included: boolean;
}

export function PricingPackages({ offers }) {
  const [packages, setPackages] = useState<PricingPackage[]>(offers)
  const [editingPackage, setEditingPackage] = useState<PricingPackage | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [error, setError] = useState<string | null>(null); // Add error state


  const handleEditPackage = (pkg: PricingPackage) => {
    setEditingPackage({ ...pkg })
    setIsDialogOpen(true)
    setError(null); // Clear error on edit
  }

  const handleDeletePackage = async (id: number) => {
    const response = await fetch(`/api/offer`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    if (response.ok) {
      setPackages(packages.filter(pkg => pkg.id !== id));
    } else {
      alert("Failed to delete package");
    }
  };

  const handleSavePackage = async () => {
    if (!editingPackage) return;

    // Client-side Validation (mirror server-side)
    if (!editingPackage.billing_cycle || !["weekly", "yearly", "monthly"].includes(editingPackage.billing_cycle)) {
      setError("Billing cycle must be weekly, yearly, or monthly");
      return;
    }
    if (!editingPackage.features || editingPackage.features.length === 0) {
      setError("Features must be a non-empty array");
      return;
    }
    if (typeof editingPackage.price !== 'number' || isNaN(editingPackage.price) || editingPackage.price <= 0) {
      setError("Price must be a number greater than 0");
      return;
    }
    if (!editingPackage.type) {
      setError("Type is required");
      return;
    }
    if (typeof editingPackage.isvip_included !== "boolean") {
      setError("isvip_included must be checked or unchecked");
      return;
    }

    if (editingPackage.isvip_included) {
      if (
        (typeof editingPackage.max_media !== "number" || editingPackage.max_media < 0) && editingPackage.max_media !== null ||
        (typeof editingPackage.max_places !== "number" || editingPackage.max_places < 0) && editingPackage.max_places !== null
      ) {
        setError("max_media and max_places must be >= 0 when isvip_included is true, or null");
        return;
      }
    }
    else {
      if (
        typeof editingPackage.max_media !== "number" || editingPackage.max_media <= 0 ||
        typeof editingPackage.max_places !== "number" || editingPackage.max_places <= 0
      ) {
        setError("max_media and max_places must be > 0 when isvip_included is false");
        return;
      }
    }



    if (editingPackage.id) {
      // Update existing package
      const response = await fetch("/api/offer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPackage),
      });

      if (response.ok) {
        setPackages(packages.map(pkg =>
          pkg.id === editingPackage.id ? editingPackage : pkg
        ));
        setIsDialogOpen(false);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to update package");
      }
    } else {
      // Add new package
      const response = await fetch("/api/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingPackage),
      });

      if (response.ok) {
        //const { data } = await response.json();  //No need to get any data back, stripe handles it
        const newPackage = { ...editingPackage, id: Date.now() } // Assign temporary ID.
        setPackages([...packages, newPackage]); // Add new package
        setIsDialogOpen(false);
        setError(null);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to add package"); // Set the error
      }
    }
  };

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
      max_places: 1,
      isvip_included: false, // Initialize isvip_included
    })
    setIsDialogOpen(true)
    setError(null); // Clear error on add
  }
  // Function to handle changes to max_media
  const handleMaxMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingPackage) {
      const value = e.target.value;
      // Allow empty string (which will become null) or a valid number
      if (value === '' || /^[0-9]+$/.test(value)) {
        setEditingPackage({
          ...editingPackage,
          max_media: value === '' ? null : parseInt(value, 10)
        });
      }
    }
  };

  // Function to handle changes to max_places
  const handleMaxPlacesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingPackage) {
      const value = e.target.value;
      if (value === '' || /^[0-9]+$/.test(value)) {
        setEditingPackage({
          ...editingPackage,
          max_places: value === '' ? null : parseInt(value, 10)
        });
      }
    }
  };


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
                <p className="text-sm text-muted-foreground mb-4">Is VIP Included: {pkg.isvip_included ? "Yes" : "No"}</p>
                <Button
                  variant="outline"
                  className="w-full mb-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => handleDeletePackage(pkg.id!)}
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Package
                </Button>
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
                <Select
                  value={editingPackage.billing_cycle}
                  onValueChange={(e) => setEditingPackage({ ...editingPackage, billing_cycle: e })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Billing Cycle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">monthly</SelectItem>
                    <SelectItem value="yearly">yearly</SelectItem>
                    <SelectItem value="weekly">weekly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maxMedia" className="text-right">
                  Max Media
                </Label>
                <Input
                  id="maxMedia"
                  type="text" // Changed to type="text"
                  value={editingPackage.max_media === null ? '' : editingPackage.max_media}  // Handle null
                  onChange={handleMaxMediaChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="maxPlaces" className="text-right">
                  Max Places
                </Label>
                <Input
                  id="maxPlaces"
                  type="text"  // Changed to type="text"
                  value={editingPackage.max_places === null ? '' : editingPackage.max_places}  // Handle null
                  onChange={handleMaxPlacesChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="isvip_included" className="text-right">
                  Is VIP Included
                </Label>
                <div className='col-span-3 flex items-center space-x-2'>
                  <Checkbox
                    id="isvip_included"
                    checked={editingPackage.isvip_included}
                    onCheckedChange={(checked) => setEditingPackage({ ...editingPackage, isvip_included: checked as boolean })}
                  />
                </div>
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
              {error && <p className="text-red-500">{error}</p>}
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
