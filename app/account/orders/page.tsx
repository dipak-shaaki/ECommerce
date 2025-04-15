"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Package, Search, CheckCircle, Clock, Truck, AlertCircle } from "lucide-react"
import Link from "next/link"
import { formatDate, formatCurrency } from "@/lib/utils"

type Order = {
  id: string
  orderNumber: string
  total: number
  status: string
  createdAt: string
  items: any[]
}

export default function OrdersPage() {
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("/api/orders")
        if (response.ok) {
          const data = await response.json()
          setOrders(data.orders || [])
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchOrders()
    }
  }, [session])

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

  const filteredOrders = orders.filter((order) => {
    // Filter by search query
    if (searchQuery && !order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Filter by tab
    if (activeTab !== "all" && order.status.toLowerCase() !== activeTab.toLowerCase()) {
      return false
    }

    return true
  })

  if (isLoading) {
    return <OrdersSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-pharmacy-dark">My Orders</h1>
          <p className="text-muted-foreground">View and track your orders</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link href="/products">
            <Button className="bg-pharmacy-primary hover:bg-pharmacy-dark">Continue Shopping</Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by order number..."
            className="w-full pl-8 border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          {filteredOrders.length > 0 ? (
            <div className="space-y-6">
              {filteredOrders.map((order) => (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="bg-pharmacy-light/30">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <div>
                          <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                          <CardDescription>Placed on {formatDate(order.createdAt)}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">{formatCurrency(order.total)}</div>
                          <div>{order.items.length} items</div>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex justify-between">
                      <div>
                        <span className="text-sm text-muted-foreground">Order Total:</span>
                        <span className="ml-2 font-medium">{formatCurrency(order.total)}</span>
                      </div>
                      <div className="space-x-2">
                        {order.status.toLowerCase() === "delivered" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-pharmacy-primary/20 text-pharmacy-primary"
                          >
                            Buy Again
                          </Button>
                        )}
                        <Link href={`/account/orders/${order.id}`}>
                          <Button size="sm" className="bg-pharmacy-primary hover:bg-pharmacy-dark">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
              <Package className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-medium">No orders found</h3>
              <p className="mb-6 text-muted-foreground">
                {searchQuery
                  ? `No orders matching "${searchQuery}"`
                  : activeTab === "all"
                    ? "You haven't placed any orders yet"
                    : `You don't have any ${activeTab} orders`}
              </p>
              <Link href="/products">
                <Button className="bg-pharmacy-primary hover:bg-pharmacy-dark">Browse Products</Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function OrdersSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-40 mt-4 sm:mt-0" />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full max-w-sm" />
      </div>

      <Skeleton className="h-12 w-full" />

      <div className="space-y-6">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  )
}
