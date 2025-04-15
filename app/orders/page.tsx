"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, Truck, CheckCircle, Clock, AlertCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"

// Mock order data
const orders = [
  {
    id: "ORD-123456",
    date: "2023-06-24",
    status: "delivered",
    total: 125.99,
    items: [
      {
        id: 1,
        name: "Paracetamol 500mg",
        price: 5.99,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1550572017-37b34bd4b88e?q=80&w=800&auto=format&fit=crop",
      },
      {
        id: 2,
        name: "Vitamin C 1000mg",
        price: 12.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?q=80&w=800&auto=format&fit=crop",
      },
    ],
    shippingAddress: "123 Main St, Anytown, CA 12345",
    trackingNumber: "TRK123456789",
  },
  {
    id: "ORD-123457",
    date: "2023-06-23",
    status: "processing",
    total: 86.47,
    items: [
      {
        id: 3,
        name: "Digital Thermometer",
        price: 8.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?q=80&w=800&auto=format&fit=crop",
      },
      {
        id: 4,
        name: "Blood Pressure Monitor",
        price: 45.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?q=80&w=800&auto=format&fit=crop",
      },
    ],
    shippingAddress: "123 Main St, Anytown, CA 12345",
    trackingNumber: "TRK123456790",
  },
  {
    id: "ORD-123458",
    date: "2023-06-22",
    status: "shipped",
    total: 42.25,
    items: [
      {
        id: 5,
        name: "Ibuprofen 200mg",
        price: 6.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1550572017-d7b84bd0591f?q=80&w=800&auto=format&fit=crop",
      },
      {
        id: 6,
        name: "First Aid Kit",
        price: 24.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?q=80&w=800&auto=format&fit=crop",
      },
    ],
    shippingAddress: "123 Main St, Anytown, CA 12345",
    trackingNumber: "TRK123456791",
  },
  {
    id: "ORD-123459",
    date: "2023-06-21",
    status: "cancelled",
    total: 52.99,
    items: [
      {
        id: 7,
        name: "Amoxicillin 500mg",
        price: 15.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?q=80&w=800&auto=format&fit=crop",
      },
      {
        id: 8,
        name: "Multivitamin Daily",
        price: 14.99,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1579165466741-7f35e4755182?q=80&w=800&auto=format&fit=crop",
      },
    ],
    shippingAddress: "123 Main St, Anytown, CA 12345",
    trackingNumber: "",
  },
]

const getStatusIcon = (status: string) => {
  switch (status) {
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
  switch (status) {
    case "delivered":
      return <Badge className="bg-green-500">Delivered</Badge>
    case "processing":
      return <Badge className="bg-blue-500">Processing</Badge>
    case "shipped":
      return <Badge className="bg-yellow-500">Shipped</Badge>
    case "cancelled":
      return <Badge className="bg-red-500">Cancelled</Badge>
    default:
      return <Badge>Unknown</Badge>
  }
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredOrders = orders.filter((order) => {
    // Filter by search query
    if (searchQuery && !order.id.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Filter by tab
    if (activeTab !== "all" && order.status !== activeTab) {
      return false
    }

    return true
  })

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-pharmacy-dark">My Orders</h1>
        <p className="text-muted-foreground">Track and manage your orders</p>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by order ID..."
              className="w-full pl-8 border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Link href="/products">
            <Button className="bg-pharmacy-primary hover:bg-pharmacy-dark">Continue Shopping</Button>
          </Link>
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
                            <CardTitle className="text-lg">{order.id}</CardTitle>
                            <CardDescription>Placed on {order.date}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="font-medium">${order.total.toFixed(2)}</div>
                            <div>{order.items.length} items</div>
                          </div>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <div>
                            <h3 className="mb-2 font-medium">Items</h3>
                            <div className="space-y-3">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex items-center gap-3">
                                  <div className="relative h-16 w-16 overflow-hidden rounded-md">
                                    <Image
                                      src={item.image || "/placeholder.svg"}
                                      alt={item.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      ${item.price.toFixed(2)} x {item.quantity}
                                    </div>
                                  </div>
                                  <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h3 className="mb-2 font-medium">Shipping Information</h3>
                            <div className="rounded-md bg-pharmacy-light/30 p-4">
                              <p className="text-sm">{order.shippingAddress}</p>
                              {order.trackingNumber && (
                                <div className="mt-2">
                                  <p className="text-xs font-medium text-muted-foreground">Tracking Number:</p>
                                  <p className="text-sm">{order.trackingNumber}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <div>
                            <span className="text-sm text-muted-foreground">Order Total:</span>
                            <span className="ml-2 font-medium">${order.total.toFixed(2)}</span>
                          </div>
                          <div className="space-x-2">
                            {order.status === "delivered" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-pharmacy-primary/20 text-pharmacy-primary"
                              >
                                Buy Again
                              </Button>
                            )}
                            <Link href={`/orders/${order.id}`}>
                              <Button size="sm" className="bg-pharmacy-primary hover:bg-pharmacy-dark">
                                View Details
                              </Button>
                            </Link>
                          </div>
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
    </div>
  )
}
