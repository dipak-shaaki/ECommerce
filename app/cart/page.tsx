"use client"

import { useState } from "react"
import Link from "next/link"
import { Trash2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useCart } from "@/contexts/cart-context"
import Image from "next/image"

export default function CartPage() {
  const { items, updateQuantity, removeItem, proceedToCheckout } = useCart()
  const [couponCode, setCouponCode] = useState("")

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 4.99
  const total = subtotal + shipping

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-pharmacy-dark">Your Cart</h1>
          <p className="text-muted-foreground">Review and manage your items</p>
        </div>

        {items.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_350px]">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({items.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">Product</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <div className="relative h-20 w-20 overflow-hidden rounded-md">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>${item.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              -
                            </Button>
                            <span>{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">${(item.price * item.quantity).toFixed(2)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Link href="/products">
                  <Button variant="outline" className="border-pharmacy-primary/20 text-pharmacy-primary">
                    Continue Shopping
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex items-center justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-pharmacy-primary hover:bg-pharmacy-dark" onClick={proceedToCheckout}>
                    Proceed to Checkout
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Have a Coupon?</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter coupon code"
                      className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button variant="outline" className="border-pharmacy-primary/20 text-pharmacy-primary">
                      Apply
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-12">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-pharmacy-dark">Your cart is empty</h2>
              <p className="text-muted-foreground">Looks like you haven't added any products to your cart yet.</p>
            </div>
            <Link href="/products">
              <Button className="bg-pharmacy-primary hover:bg-pharmacy-dark">Browse Products</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
