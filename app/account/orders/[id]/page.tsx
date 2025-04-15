"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Package, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { formatDate, formatCurrency } from "@/lib/utils"
import Image from "next/image"

export default function OrderDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState<any>(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`)
        if (response.ok) {
          const data = await response.json()
          setOrder(data)
        } else {
          // Handle error - order not found or not authorized
          router.push("/account/orders")
        }
      } catch (error) {
        console.error("Error fetching order details:", error)
        router.push("/account/orders")
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchOrderDetails()
    }
  }, [id, session, router])

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "processing":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-yellow-500" />
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>
      case "processing":
        return <Badge className="bg-blue-500">Processing</Badge>
      case "shipped":
        return <Badge className="bg-yellow-500">Shipped</Badge>
      case "cancelled":
        return <Badge className="bg-red-500">Cancelled</Badge>
      default:
        return <Badge>Pending</Badge>
    }
  }

  if (isLoading) {
    return <OrderDetailsSkeleton />
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <Package className="mb-4 h-12 w-12 text-muted-foreground" />
        <h3 className="mb-2 text-lg font-medium">Order not found</h3>
        <p className="mb-6 text-muted-foreground">
          The order you're looking for doesn't exist or you don't have access to it.
        </p>
        <Link href="/account/orders">
          <Button className="bg-pharmacy-primary hover:bg-pharmacy-dark">Back to Orders</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/account/orders">
            <Button variant="ghost" className="mb-2 pl-0 text-pharmacy-primary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-pharmacy-dark">Order Details</h1>
          <p className="text-muted-foreground">Order #{order.orderNumber}</p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-2">
          {getStatusBadge(order.status)}
          <span className="text-sm text-muted-foreground">Placed on {formatDate(order.createdAt)}</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>Order details and tracking information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="mb-2 font-medium">Items</h3>
              <div className="space-y-3">
                {order.items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      {item.product?.images?.[0] ? (
                        <Image
                          src={item.product.images[0] || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(Number(item.price))} x {item.quantity}
                      </div>
                    </div>
                    <div className="font-medium">{formatCurrency(Number(item.price) * item.quantity)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-medium">Shipping Information</h3>
                <div className="rounded-md bg-pharmacy-light/30 p-4">
                  <p className="font-medium">{order.address.fullName}</p>
                  <p className="text-sm">{order.address.address}</p>
                  <p className="text-sm">
                    {order.address.city}, {order.address.state} {order.address.zipCode}
                  </p>
                  <p className="text-sm">{order.address.phone}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Payment Information</h3>
                <div className="rounded-md bg-pharmacy-light/30 p-4">
                  <p className="font-medium">Payment Method</p>
                  <p className="text-sm capitalize">{order.paymentMethod}</p>
                  <p className="mt-2 font-medium">Payment Status</p>
                  <p className="text-sm capitalize">{order.paymentStatus}</p>
                </div>
              </div>

              {order.trackingNumber && (
                <div>
                  <h3 className="mb-2 font-medium">Tracking Information</h3>
                  <div className="rounded-md bg-pharmacy-light/30 p-4">
                    <p className="font-medium">Tracking Number</p>
                    <p className="text-sm">{order.trackingNumber}</p>
                    <p className="mt-2 font-medium">Shipping Method</p>
                    <p className="text-sm capitalize">{order.shippingMethod}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(Number(order.subtotal))}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatCurrency(Number(order.shippingCost))}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatCurrency(Number(order.tax))}</span>
            </div>
            {order.discount && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatCurrency(Number(order.discount))}</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>{formatCurrency(Number(order.total))}</span>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              className="border-pharmacy-primary/20 text-pharmacy-primary"
              onClick={() => window.print()}
            >
              Print Receipt
            </Button>
            {order.status.toLowerCase() === "delivered" && (
              <Button className="bg-pharmacy-primary hover:bg-pharmacy-dark">Buy Again</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function OrderDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-10 w-32 mb-2" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32 mt-1" />
        </div>
        <div className="mt-4 sm:mt-0 flex items-center gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>

      <Skeleton className="h-[500px] w-full" />
    </div>
  )
}
