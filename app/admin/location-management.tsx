'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Trash2, Edit, MapPin } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import { DialogHeader } from '@/components/ui/dialog'
import { Label } from 'recharts'

interface Location {
  id?: number
  name: string
  country: string
  region: string
  city: string
}

export function LocationManagement({ locations_fetched }) {
  const [locations, setLocations] = useState<Location[]>(locations_fetched)
  const [newLocation, setNewLocation] = useState<Location>({})
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false)
  const supabase = createClientComponentClient()

  const handleAddLocation = async () => {
    if (newLocation?.name && newLocation.name.trim() === '') return
    const locationInsertResponse = await fetch("/api/offer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLocation),
    });
    if (!locationInsertResponse.ok) alert("Failed to update offer: " + locationInsertResponse.statusText)
    const { data, error } = await locationInsertResponse.json()
    if (error) console.error('Error adding package:', error)
    else {
      setLocations([...locations, data])
      setNewLocation({})
    }
  }

  const handleEditLocation = async (location: Location) => {
    setEditingLocation(location)
  }

  const handleUpdateLocation = async () => {
    if (!editingLocation) return
    // Update existing package
    const locationUpdateResponse = await fetch("/api/locations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingLocation),
    });
    if (!locationUpdateResponse.ok) alert("Failed to update offer: " + locationUpdateResponse.statusText)
    const { error } = await locationUpdateResponse.json()
    if (error) console.error('Error updating package:', error)
    else {
      setLocations(locations.map(loc => loc.id === editingLocation.id ? editingLocation : loc))
      setEditingLocation(null)
    }
  }

  const handleDeleteLocation = async (id: number) => {
    const locationDeleteResponse = await fetch("/api/locations", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingLocation),
    });
    if (!locationDeleteResponse.ok) alert("Failed to update offer: " + locationDeleteResponse.statusText)
    const { error } = await locationDeleteResponse.json()
    if (error) {
      console.error('Error deleting location:', error)
    } else {
      setLocations(locations.filter(loc => loc.id !== id))
    }
  }

  return (
    <>
      <div>
        <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Location Name
                </Label>
                <Input
                  id="name"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddLocation}>Add Location</Button>
          </DialogContent>
        </Dialog>
        <Button
          onClick={() => setIsLocationDialogOpen(true)}
          className="mb-4"
        >
          <MapPin className="mr-2 h-4 w-4" />
          Add New Location
        </Button>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell>
                  {editingLocation?.id === location.id ? (
                    <Input
                      value={editingLocation.name}
                      onChange={(e) => setEditingLocation({ ...editingLocation, name: e.target.value })}
                    />
                  ) : (
                    location.name
                  )}
                </TableCell>
                <TableCell>
                  {editingLocation?.id === location.id ? (
                    <Button onClick={handleUpdateLocation}>Save</Button>
                  ) : (
                    <Button variant="ghost" onClick={() => handleEditLocation(location)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button variant="ghost" onClick={() => handleDeleteLocation(location.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
