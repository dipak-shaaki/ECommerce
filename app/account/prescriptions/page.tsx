"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
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
import { FileText, Upload, Clock, CheckCircle, XCircle, Plus, Eye } from "lucide-react"
import { formatDate } from "@/lib/utils"
import Image from "next/image"

type Prescription = {
  id: string
  image: string
  status: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export default function PrescriptionsPage() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [currentPrescription, setCurrentPrescription] = useState<Prescription | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [notes, setNotes] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const response = await fetch("/api/prescriptions")
        if (response.ok) {
          const data = await response.json()
          setPrescriptions(data.prescriptions || [])
        }
      } catch (error) {
        console.error("Error fetching prescriptions:", error)
        toast({
          title: "Error",
          description: "Failed to load prescriptions. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchPrescriptions()
    }
  }, [session, toast])

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <Badge className="bg-green-500">Approved</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-500">Rejected</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <FileText className="h-5 w-5 text-gray-500" />
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload your prescription before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // First, upload the file
      const formData = new FormData()
      formData.append("file", file)

      const uploadResponse = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file")
      }

      const uploadData = await uploadResponse.json()
      const imageUrl = uploadData.url

      // Then, create the prescription record
      const prescriptionResponse = await fetch("/api/prescriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageUrl,
          notes,
        }),
      })

      if (!prescriptionResponse.ok) {
        throw new Error("Failed to create prescription record")
      }

      const newPrescription = await prescriptionResponse.json()
      setPrescriptions((prev) => [newPrescription, ...prev])

      toast({
        title: "Prescription uploaded",
        description: "Your prescription has been uploaded successfully.",
      })

      setFile(null)
      setNotes("")
      setIsUploadDialogOpen(false)
    } catch (error) {
      console.error("Error uploading prescription:", error)
      toast({
        title: "Error",
        description: "Failed to upload prescription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleViewPrescription = (prescription: Prescription) => {
    setCurrentPrescription(prescription)
    setIsViewDialogOpen(true)
  }

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    if (activeTab === "all") return true
    return prescription.status.toLowerCase() === activeTab.toLowerCase()
  })

  if (isLoading) {
    return <PrescriptionsSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-pharmacy-dark">My Prescriptions</h1>
          <p className="text-muted-foreground">Manage your uploaded prescriptions</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-pharmacy-primary hover:bg-pharmacy-dark">
                <Plus className="mr-2 h-4 w-4" />
                Upload Prescription
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Upload Prescription</DialogTitle>
                <DialogDescription>Upload a clear image of your prescription for verification.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleUpload}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="prescription">Prescription Image</Label>
                    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-pharmacy-primary/30 p-6 bg-pharmacy-light/50">
                      <div className="rounded-full bg-pharmacy-primary/10 p-4">
                        <Upload className="h-6 w-6 text-pharmacy-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium">
                          {file ? file.name : "Drag and drop your file here or click to browse"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Supported formats: JPG, PNG, PDF (Max size: 5MB)
                        </p>
                      </div>
                      <Input
                        id="prescription"
                        type="file"
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handleFileChange}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="border-pharmacy-primary text-pharmacy-primary hover:bg-pharmacy-light"
                        onClick={() => document.getElementById("prescription")?.click()}
                      >
                        Browse Files
                      </Button>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any specific instructions or details about your prescription"
                      className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsUploadDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-pharmacy-primary hover:bg-pharmacy-dark"
                    disabled={isUploading || !file}
                  >
                    {isUploading ? "Uploading..." : "Upload Prescription"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          {filteredPrescriptions.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredPrescriptions.map((prescription) => (
                <Card key={prescription.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="relative h-48 w-full">
                      <Image
                        src={prescription.image || "/placeholder.svg"}
                        alt="Prescription"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button variant="secondary" size="sm" onClick={() => handleViewPrescription(prescription)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                      </div>
                      <div className="absolute right-2 top-2">{getStatusBadge(prescription.status)}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(prescription.status)}
                      <div>
                        <p className="font-medium">Prescription #{prescription.id.slice(-6)}</p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded on {formatDate(prescription.createdAt)}
                        </p>
                      </div>
                    </div>
                    {prescription.notes && (
                      <div className="mt-2 text-sm">
                        <p className="font-medium">Notes:</p>
                        <p className="text-muted-foreground">{prescription.notes}</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" variant="outline" onClick={() => handleViewPrescription(prescription)}>
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No prescriptions found</h3>
              <p className="mb-6 text-muted-foreground">
                {activeTab === "all"
                  ? "You haven't uploaded any prescriptions yet."
                  : `You don't have any ${activeTab} prescriptions.`}
              </p>
              <Button
                className="bg-pharmacy-primary hover:bg-pharmacy-dark"
                onClick={() => setIsUploadDialogOpen(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Upload Prescription
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* View Prescription Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Prescription Details</DialogTitle>
            <DialogDescription>
              Prescription #{currentPrescription?.id.slice(-6)} - {formatDate(currentPrescription?.createdAt || "")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="relative h-80 w-full">
              <Image
                src={currentPrescription?.image || "/placeholder.svg"}
                alt="Prescription"
                fill
                className="object-contain"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Status:</span>
              {currentPrescription && getStatusBadge(currentPrescription.status)}
            </div>
            {currentPrescription?.notes && (
              <div>
                <span className="font-medium">Notes:</span>
                <p className="mt-1 text-sm text-muted-foreground">{currentPrescription.notes}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function PrescriptionsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-1" />
        </div>
        <Skeleton className="h-10 w-40 mt-4 sm:mt-0" />
      </div>

      <Skeleton className="h-12 w-full" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  )
}
