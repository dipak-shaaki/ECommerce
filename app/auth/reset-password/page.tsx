"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, CheckCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  const [token, setToken] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      setToken(token)
    } else {
      toast({
        title: "Invalid reset link",
        description: "The password reset link is invalid or has expired.",
        variant: "destructive",
      })
    }
  }, [searchParams, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      })

      if (response.ok) {
        setIsSuccess(true)
        setTimeout(() => {
          router.push("/auth/signin")
        }, 3000)
      } else {
        const data = await response.json()
        toast({
          title: "Error",
          description: data.error || "Something went wrong",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!token && !isSuccess) {
    return (
      <div className="container flex h-screen w-screen flex-col items-center justify-center">
        <Card className="w-full max-w-md border-pharmacy-primary/20">
          <CardHeader className="bg-pharmacy-light">
            <CardTitle className="text-pharmacy-dark">Invalid Reset Link</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-center">The password reset link is invalid or has expired.</p>
          </CardContent>
          <CardFooter className="flex justify-center bg-pharmacy-light/30">
            <Link href="/auth/forgot-password">
              <Button className="bg-pharmacy-primary hover:bg-pharmacy-dark">Request New Reset Link</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-pharmacy-dark">Reset Password</h1>
          <p className="text-sm text-muted-foreground">Create a new password for your account</p>
        </div>

        <Card className="border-pharmacy-primary/20">
          {!isSuccess ? (
            <form onSubmit={handleSubmit}>
              <CardHeader className="bg-pharmacy-light">
                <CardTitle className="text-pharmacy-dark">New Password</CardTitle>
                <CardDescription>Please enter your new password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary pr-10"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary pr-10"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col bg-pharmacy-light/30">
                <Button
                  className="w-full bg-pharmacy-primary hover:bg-pharmacy-dark"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </CardFooter>
            </form>
          ) : (
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Password Reset Successful</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Your password has been reset successfully. You will be redirected to the login page.
              </p>
              <Link href="/auth/signin">
                <Button className="bg-pharmacy-primary hover:bg-pharmacy-dark">Go to Login</Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
