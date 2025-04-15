"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { getInitials } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

export default function SettingsPage() {
  const { data: session, update } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [userData, setUserData] = useState<any>(null)
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    image: "",
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/users/me")
        if (response.ok) {
          const data = await response.json()
          setUserData(data)
          setProfileForm({
            name: data.name || "",
            email: data.email || "",
            image: data.image || "",
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchUserData()
    }
  }, [session, toast])

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: profileForm.name,
          email: profileForm.email,
          image: profileForm.image,
        }),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUserData(updatedUser)

        // Update session data
        await update({
          ...session,
          user: {
            ...session?.user,
            name: updatedUser.name,
            email: updatedUser.email,
            image: updatedUser.image,
          },
        })

        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "New password and confirm password must match.",
        variant: "destructive",
      })
      return
    }

    if (passwordForm.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      })

      if (response.ok) {
        toast({
          title: "Password updated",
          description: "Your password has been updated successfully.",
        })

        // Reset password form
        setPasswordForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
      } else {
        const error = await response.json()
        throw new Error(error.error || "Failed to update password")
      }
    } catch (error) {
      console.error("Error updating password:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <SettingsSkeleton />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-pharmacy-dark">Account Settings</h1>

      <Card>
        <form onSubmit={handleProfileSubmit}>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your account profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={profileForm.image || ""} alt={profileForm.name || "User"} />
                <AvatarFallback className="text-lg bg-pharmacy-primary/20 text-pharmacy-primary">
                  {getInitials(profileForm.name || "User")}
                </AvatarFallback>
              </Avatar>
              <div>
                <Label htmlFor="image">Profile Picture</Label>
                <Input
                  id="image"
                  name="image"
                  type="text"
                  placeholder="Enter image URL"
                  value={profileForm.image}
                  onChange={handleProfileChange}
                  className="mt-1 border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profileForm.email}
                  onChange={handleProfileChange}
                  className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="bg-pharmacy-primary hover:bg-pharmacy-dark" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <form onSubmit={handlePasswordSubmit}>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="bg-pharmacy-primary hover:bg-pharmacy-dark" disabled={isSaving}>
              {isSaving ? "Updating..." : "Update Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />

      <div className="space-y-2">
        <Skeleton className="h-64 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  )
}
