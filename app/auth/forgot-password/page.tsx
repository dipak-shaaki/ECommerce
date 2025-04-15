"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Mail } from "lucide-react"

export default function ForgotPasswordPage() {
  const { toast } = useToast()
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setIsSubmitted(true)
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

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[400px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-pharmacy-dark">Forgot Password</h1>
          <p className="text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password
          </p>
        </div>

        <Card className="border-pharmacy-primary/20">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit}>
              <CardHeader className="bg-pharmacy-light">
                <CardTitle className="text-pharmacy-dark">Reset Password</CardTitle>
                <CardDescription>We'll email you a link to reset your password</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                    disabled={isLoading}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col bg-pharmacy-light/30">
                <Button
                  className="w-full bg-pharmacy-primary hover:bg-pharmacy-dark"
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>

                <div className="mt-4 text-center text-sm">
                  Remember your password?{" "}
                  <Link href="/auth/signin" className="text-pharmacy-primary hover:underline">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          ) : (
            <div className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-pharmacy-light">
                <Mail className="h-6 w-6 text-pharmacy-primary" />
              </div>
              <h3 className="mb-2 text-lg font-medium">Check your email</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
              <p className="text-xs text-muted-foreground">
                If you don't see it, check your spam folder or{" "}
                <button onClick={() => setIsSubmitted(false)} className="text-pharmacy-primary hover:underline">
                  try again
                </button>
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
