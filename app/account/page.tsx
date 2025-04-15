"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { getInitials } from "@/lib/utils"
import { Package, FileText, MapPin, Calendar } from "lucide-react"
import Link from "next/link"

export default function AccountPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState<any>(null)
  const [stats, setStats] = useState({
    orders: 0,
    prescriptions: 0,
    addresses: 0,
  })

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user profile data
        const userResponse = await fetch("/api/users/me")
        if (userResponse.ok) {
          const userData = await userResponse.json()
          setUserData(userData)
        }

        // Fetch user stats
        const ordersResponse = await fetch("/api/orders?limit=1")
        const prescriptionsResponse = await fetch("/api/prescriptions?limit=1")
        const addressesResponse = await fetch("/api/addresses")

        if (ordersResponse.ok && prescriptionsResponse.ok && addressesResponse.ok) {
          const ordersData = await ordersResponse.json()
          const prescriptionsData = await prescriptionsResponse.json()
          const addressesData = await addressesResponse.json()

          setStats({
            orders: ordersData.pagination?.total || 0,
            prescriptions: prescriptionsData.pagination?.total || 0,
            addresses: addressesData.length || 0,
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchUserData()
    }
  }, [session])

  if (isLoading) {
    return <AccountSkeleton />
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-pharmacy-dark">Account Overview</h1>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={userData?.image || ""} alt={userData?.name || "User"} />
            <AvatarFallback className="text-lg bg-pharmacy-primary/20 text-pharmacy-primary">
              {getInitials(userData?.name || "User")}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle>{userData?.name}</CardTitle>
            <CardDescription>{userData?.email}</CardDescription>
            <p className="text-xs text-muted-foreground mt-1">
              Member since {new Date(userData?.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="ml-auto">
            <Link href="/account/settings">
              <Button variant="outline" className="border-pharmacy-primary/20 text-pharmacy-primary">
                Edit Profile
              </Button>
            </Link>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/account/orders">
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">My Orders</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.orders}</div>
              <p className="text-xs text-muted-foreground">Total orders placed</p>
              <div className="mt-4 flex items-center text-sm text-pharmacy-primary">
                View order history
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1 h-4 w-4"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/account/prescriptions">
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">My Prescriptions</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.prescriptions}</div>
              <p className="text-xs text-muted-foreground">Uploaded prescriptions</p>
              <div className="mt-4 flex items-center text-sm text-pharmacy-primary">
                Manage prescriptions
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1 h-4 w-4"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/account/addresses">
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">My Addresses</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.addresses}</div>
              <p className="text-xs text-muted-foreground">Saved addresses</p>
              <div className="mt-4 flex items-center text-sm text-pharmacy-primary">
                Manage addresses
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1 h-4 w-4"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent orders and prescriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-pharmacy-light p-2">
                <Calendar className="h-4 w-4 text-pharmacy-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Account created</p>
                <p className="text-xs text-muted-foreground">{new Date(userData?.createdAt).toLocaleDateString()}</p>
              </div>
              <Button variant="ghost" size="sm" className="text-pharmacy-primary">
                View
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AccountSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />

      <div className="space-y-2">
        <Skeleton className="h-32 w-full" />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-64 w-full" />
      </div>
    </div>
  )
}
