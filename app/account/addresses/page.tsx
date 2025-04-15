"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { MapPin, Plus, Pencil, Trash2 } from "lucide-react"

type Address = {
  id: string
  fullName: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  isDefault: boolean
}

export default function AddressesPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
    isDefault: false,
  })

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await fetch("/api/addresses")
        if (response.ok) {
          const data = await response.json()
          setAddresses(data)
        }
      } catch (error) {
        console.error("Error fetching addresses:", error)
        toast({
          title: "Error",
          description: "Failed to load addresses. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchAddresses()
    }
  }, [session, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const resetForm = () => {
    setFormData({
      fullName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      phone: "",
      isDefault: false,
    })
  }

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/addresses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const newAddress = await response.json()
        setAddresses((prev) => {
          // If the new address is default, update all other addresses
          if (newAddress.isDefault) {
            return [newAddress, ...prev.map((addr) => ({ ...addr, isDefault: false }))]
          }
          return [...prev, newAddress]
        })

        toast({
          title: "Address added",
          description: "Your address has been added successfully.",
        })

        resetForm()
        setIsAddDialogOpen(false)
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to add address")
      }
    } catch (error) {
      console.error("Error adding address:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add address. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditAddress = (address: Address) => {
    setCurrentAddress(address)
    setFormData({
      fullName: address.fullName,
      address: address.address,
      city: address.city,
      state: address.state || "",
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateAddress = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentAddress) return

    try {
      const response = await fetch(`/api/addresses/${currentAddress.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedAddress = await response.json()
        setAddresses((prev) => {
          // If the updated address is default, update all other addresses
          if (updatedAddress.isDefault) {
            return prev.map((addr) => (addr.id === updatedAddress.id ? updatedAddress : { ...addr, isDefault: false }))
          }
          return prev.map((addr) => (addr.id === updatedAddress.id ? updatedAddress : addr))
        })

        toast({
          title: "Address updated",
          description: "Your address has been updated successfully.",
        })

        resetForm()
        setCurrentAddress(null)
        setIsEditDialogOpen(false)
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to update address")
      }
    } catch (error) {
      console.error("Error updating address:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update address. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePrompt = (address: Address) => {
    setCurrentAddress(address)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteAddress = async () => {
    if (!currentAddress) return

    try {
      const response = await fetch(`/api/addresses/${currentAddress.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setAddresses((prev) => prev.filter((addr) => addr.id !== currentAddress.id))

        toast({
          title: "Address deleted",
          description: "Your address has been deleted successfully.",
        })

        setCurrentAddress(null)
        setIsDeleteDialogOpen(false)
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete address")
      }
    } catch (error) {
      console.error("Error deleting address:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete address. Please try again.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <AddressesSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-pharmacy-dark">My Addresses</h1>
          <p className="text-muted-foreground">Manage your shipping addresses</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-pharmacy-primary hover:bg-pharmacy-dark">
                <Plus className="mr-2 h-4 w-4" />
                Add New Address
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
                <DialogDescription>Add a new shipping address to your account.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddAddress}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="zipCode">ZIP Code</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isDefault"
                      name="isDefault"
                      checked={formData.isDefault}
                      onChange={handleCheckboxChange}
                      className="h-4 w-4 rounded border-gray-300 text-pharmacy-primary focus:ring-pharmacy-primary"
                    />
                    <Label htmlFor="isDefault">Set as default address</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-pharmacy-primary hover:bg-pharmacy-dark">
                    Save Address
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {addresses.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {addresses.map((address) => (
            <Card key={address.id} className={address.isDefault ? "border-pharmacy-primary" : ""}>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4 text-pharmacy-primary" />
                    {address.fullName}
                  </CardTitle>
                  {address.isDefault && <Badge className="mt-1 bg-pharmacy-primary">Default</Badge>}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditAddress(address)}
                    className="h-8 w-8 text-pharmacy-primary"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeletePrompt(address)}
                    className="h-8 w-8 text-red-500"
                    disabled={address.isDefault}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm">
                  <p>{address.address}</p>
                  <p>
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p>{address.country}</p>
                  <p className="font-medium mt-2">Phone: {address.phone}</p>
                </div>
              </CardContent>
              <CardFooter>
                {!address.isDefault && (
                  <Button
                    variant="outline"
                    className="w-full border-pharmacy-primary/20 text-pharmacy-primary"
                    onClick={async () => {
                      try {
                        const response = await fetch(`/api/addresses/${address.id}`, {
                          method: "PUT",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({ ...address, isDefault: true }),
                        })

                        if (response.ok) {
                          setAddresses((prev) =>
                            prev.map((addr) =>
                              addr.id === address.id ? { ...addr, isDefault: true } : { ...addr, isDefault: false },
                            ),
                          )

                          toast({
                            title: "Default address updated",
                            description: "Your default address has been updated.",
                          })
                        }
                      } catch (error) {
                        console.error("Error updating default address:", error)
                        toast({
                          title: "Error",
                          description: "Failed to update default address. Please try again.",
                          variant: "destructive",
                        })
                      }
                    }}
                  >
                    Set as Default
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <MapPin className="mb-4 h-12 w-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium">No addresses found</h3>
          <p className="mb-6 text-muted-foreground">
            You haven't added any addresses yet. Add an address to make checkout easier.
          </p>
          <Button className="bg-pharmacy-primary hover:bg-pharmacy-dark" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Address
          </Button>
        </div>
      )}

      {/* Edit Address Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
            <DialogDescription>Update your shipping address details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateAddress}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-fullName">Full Name</Label>
                <Input
                  id="edit-fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Address</Label>
                <Textarea
                  id="edit-address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-city">City</Label>
                  <Input
                    id="edit-city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-state">State</Label>
                  <Input
                    id="edit-state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-zipCode">ZIP Code</Label>
                  <Input
                    id="edit-zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input
                    id="edit-phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isDefault"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300 text-pharmacy-primary focus:ring-pharmacy-primary"
                />
                <Label htmlFor="edit-isDefault">Set as default address</Label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="bg-pharmacy-primary hover:bg-pharmacy-dark">
                Update Address
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Address Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Address</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteAddress}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AddressesSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-1" />
        </div>
        <Skeleton className="h-10 w-40 mt-4 sm:mt-0" />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  )
}
