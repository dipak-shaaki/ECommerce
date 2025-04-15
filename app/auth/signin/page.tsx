"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff } from "lucide-react"
import Image from "next/image"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: "Authentication failed",
          description: "Invalid email or password",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "You have been signed in",
        })
        router.push(callbackUrl)
      }
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl })
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-10">
      <div className="mx-auto grid w-full max-w-[900px] grid-cols-1 overflow-hidden rounded-lg border border-pharmacy-primary/20 shadow-lg md:grid-cols-2">
        <div className="hidden md:block">
          <div className="relative h-full w-full">
            <Image
              src="https://images.unsplash.com/photo-1631549916768-4119b4123a31?q=80&w=1000&auto=format&fit=crop"
              alt="Pharmacy image"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-pharmacy-primary/40 flex flex-col items-center justify-center p-6 text-white">
              <h2 className="mb-2 text-2xl font-bold">Welcome Back</h2>
              <p className="text-center">Access your account to manage your healthcare needs</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-pharmacy-dark">Sign In to MediMart</h1>
            <p className="text-sm text-muted-foreground">Enter your credentials to access your account</p>
          </div>

          <Tabs defaultValue="credentials" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="credentials">Email</TabsTrigger>
              <TabsTrigger value="google">Google</TabsTrigger>
            </TabsList>

            <TabsContent value="credentials">
              <form onSubmit={handleSignIn}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <Link href="/auth/forgot-password" className="text-xs text-pharmacy-primary hover:underline">
                        Forgot password?
                      </Link>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary pr-10"
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
                  <Button
                    className="w-full bg-pharmacy-primary hover:bg-pharmacy-dark"
                    type="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>

                  <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/register" className="text-pharmacy-primary hover:underline">
                      Sign up
                    </Link>
                  </div>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="google">
              <div className="space-y-4 py-4">
                <Button className="w-full" variant="outline" onClick={handleGoogleSignIn} disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign in with Google"}
                </Button>
                <div className="text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link href="/auth/register" className="text-pharmacy-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
