"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PrescriptionsPage() {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload your prescription before submitting.",
        variant: "destructive",
      })
      return
    }

    setUploading(true)

    // Simulate upload
    setTimeout(() => {
      setUploading(false)
      toast({
        title: "Prescription uploaded successfully",
        description: "Our pharmacist will review your prescription shortly.",
      })
      setFile(null)
    }, 2000)
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-pharmacy-dark">Upload Prescription</h1>
          <p className="text-muted-foreground">Upload your prescription to order prescription medications</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="border-b bg-pharmacy-light">
              <CardTitle className="text-pharmacy-dark">Upload Your Prescription</CardTitle>
              <CardDescription>Please upload a clear image or PDF of your valid prescription</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      required
                      className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="Enter your phone number"
                      required
                      className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="prescription">Upload Prescription</Label>
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
                      placeholder="Any specific instructions or details about your prescription"
                      className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                    />
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="bg-pharmacy-light/30">
              <Button
                className="w-full bg-pharmacy-primary hover:bg-pharmacy-dark"
                onClick={handleSubmit}
                disabled={uploading}
              >
                {uploading ? (
                  <>Uploading...</>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Submit Prescription
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <Card className="border-pharmacy-primary/20">
              <CardHeader className="bg-pharmacy-light">
                <CardTitle className="text-pharmacy-dark">How It Works</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pharmacy-primary text-primary-foreground">
                      1
                    </div>
                    <div>
                      <h3 className="font-medium text-pharmacy-dark">Upload Your Prescription</h3>
                      <p className="text-sm text-muted-foreground">
                        Upload a clear image or PDF of your valid prescription issued by a licensed doctor.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pharmacy-primary text-primary-foreground">
                      2
                    </div>
                    <div>
                      <h3 className="font-medium text-pharmacy-dark">Verification</h3>
                      <p className="text-sm text-muted-foreground">
                        Our licensed pharmacists will verify your prescription and contact you if needed.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pharmacy-primary text-primary-foreground">
                      3
                    </div>
                    <div>
                      <h3 className="font-medium text-pharmacy-dark">Order Confirmation</h3>
                      <p className="text-sm text-muted-foreground">
                        Once verified, we'll confirm your order and process the payment.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pharmacy-primary text-primary-foreground">
                      4
                    </div>
                    <div>
                      <h3 className="font-medium text-pharmacy-dark">Delivery</h3>
                      <p className="text-sm text-muted-foreground">
                        Your medications will be safely packaged and delivered to your doorstep.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-pharmacy-primary/20">
              <CardHeader className="bg-pharmacy-light">
                <CardTitle className="text-pharmacy-dark">Prescription Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-pharmacy-primary" />
                    <span>Prescription must be issued by a licensed healthcare provider</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-pharmacy-primary" />
                    <span>Ensure the prescription is clear and all details are visible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-pharmacy-primary" />
                    <span>Prescription must include doctor's name, registration number, and signature</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-pharmacy-primary" />
                    <span>Prescription should not be older than 6 months</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-pharmacy-primary" />
                    <span>We cannot accept prescriptions for controlled substances</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
