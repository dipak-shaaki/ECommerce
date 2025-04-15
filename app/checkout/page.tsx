"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ArrowRight, CreditCard, Truck, CheckCircle } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useSession } from "next-auth/react"

type CheckoutStep = "shipping" | "payment" | "confirmation"

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status } = useSession()
  const { items, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping")
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    phone: "",
  })
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })
  const [shippingMethod, setShippingMethod] = useState("standard")
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderId, setOrderId] = useState("")

  // Calculate order totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = shippingMethod === "standard" ? 4.99 : 9.99
  const total = subtotal + shipping

  // Check if user is authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      toast({
        title: "Sign in required",
        description: "Please sign in to complete your purchase",
        variant: "destructive",
      })
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent("/checkout")}`)
    }
  }, [status, router, toast])

  // If still loading or not authenticated, show loading state
  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="container py-10 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Checking your account...</h2>
          <p className="text-muted-foreground">Please wait while we verify your account.</p>
        </div>
      </div>
    )
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!shippingInfo.fullName || !shippingInfo.address || !shippingInfo.city || !shippingInfo.zipCode) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }
    setCurrentStep("payment")
  }

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (paymentMethod === "credit-card") {
      // Basic validation for credit card
      if (!paymentInfo.cardNumber || !paymentInfo.cardName || !paymentInfo.expiryDate || !paymentInfo.cvv) {
        toast({
          title: "Missing payment information",
          description: "Please fill in all required payment fields.",
          variant: "destructive",
        })
        return
      }
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setOrderId(`ORD-${Math.floor(100000 + Math.random() * 900000)}`)
      setCurrentStep("confirmation")

      // Clear the cart after successful order
      if (currentStep === "payment") {
        clearCart()
      }
    }, 2000)
  }

  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setShippingInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPaymentInfo((prev) => ({ ...prev, [name]: value }))
  }

  // If cart is empty and not in confirmation step, redirect to cart page
  if (items.length === 0 && currentStep !== "confirmation") {
    return (
      <div className="container py-10">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Add some products to your cart before checking out.</p>
          <Link href="/products">
            <Button className="bg-pharmacy-primary hover:bg-pharmacy-dark">Browse Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-pharmacy-dark">Checkout</h1>
        <p className="text-muted-foreground">Complete your order</p>
      </div>

      <div className="grid gap-8 md:grid-cols-[1fr_350px]">
        <div>
          <Tabs value={currentStep} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="shipping" disabled={currentStep !== "shipping"}>
                1. Shipping
              </TabsTrigger>
              <TabsTrigger value="payment" disabled={currentStep !== "payment"}>
                2. Payment
              </TabsTrigger>
              <TabsTrigger value="confirmation" disabled={currentStep !== "confirmation"}>
                3. Confirmation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="shipping">
              <Card>
                <form onSubmit={handleShippingSubmit}>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                    <CardDescription>Enter your shipping details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          name="fullName"
                          value={shippingInfo.fullName}
                          onChange={handleShippingInfoChange}
                          className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                          required
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          name="address"
                          value={shippingInfo.address}
                          onChange={handleShippingInfoChange}
                          className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            name="city"
                            value={shippingInfo.city}
                            onChange={handleShippingInfoChange}
                            className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            name="state"
                            value={shippingInfo.state}
                            onChange={handleShippingInfoChange}
                            className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            name="zipCode"
                            value={shippingInfo.zipCode}
                            onChange={handleShippingInfoChange}
                            className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                            required
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={shippingInfo.phone}
                            onChange={handleShippingInfoChange}
                            className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Shipping Method</h3>
                      <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="grid gap-4">
                        <div className="flex items-center space-x-2 rounded-md border border-pharmacy-primary/20 p-4">
                          <RadioGroupItem value="standard" id="standard" />
                          <Label htmlFor="standard" className="flex flex-1 items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Standard Shipping</p>
                              <p className="text-xs text-muted-foreground">3-5 business days</p>
                            </div>
                            <p className="text-sm font-medium">$4.99</p>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2 rounded-md border border-pharmacy-primary/20 p-4">
                          <RadioGroupItem value="express" id="express" />
                          <Label htmlFor="express" className="flex flex-1 items-center justify-between">
                            <div>
                              <p className="text-sm font-medium">Express Shipping</p>
                              <p className="text-xs text-muted-foreground">1-2 business days</p>
                            </div>
                            <p className="text-sm font-medium">$9.99</p>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Link href="/cart">
                      <Button variant="outline" className="border-pharmacy-primary/20 text-pharmacy-primary">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Cart
                      </Button>
                    </Link>
                    <Button type="submit" className="bg-pharmacy-primary hover:bg-pharmacy-dark">
                      Continue to Payment
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="payment">
              <Card>
                <form onSubmit={handlePaymentSubmit}>
                  <CardHeader>
                    <CardTitle>Payment Information</CardTitle>
                    <CardDescription>Choose your payment method</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid gap-4">
                      <div className="flex items-center space-x-2 rounded-md border border-pharmacy-primary/20 p-4">
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <Label htmlFor="credit-card" className="flex flex-1 items-center">
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>Credit/Debit Card</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border border-pharmacy-primary/20 p-4">
                        <RadioGroupItem value="paypal" id="paypal" />
                        <Label htmlFor="paypal" className="flex flex-1 items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="mr-2 h-4 w-4"
                          >
                            <path d="M17.5 7H20.5C21.3 7 22 7.7 22 8.5C22 9.3 21.3 10 20.5 10H17.5" />
                            <path d="M2 10H4.5C5.3 10 6 9.3 6 8.5C6 7.7 5.3 7 4.5 7H2" />
                            <path d="M2 7V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V8.5" />
                            <path d="M2 13H22" />
                          </svg>
                          <span>PayPal</span>
                        </Label>
                      </div>
                    </RadioGroup>

                    {paymentMethod === "credit-card" && (
                      <div className="mt-4 space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={paymentInfo.cardNumber}
                            onChange={handlePaymentInfoChange}
                            className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="cardName">Name on Card</Label>
                          <Input
                            id="cardName"
                            name="cardName"
                            placeholder="John Doe"
                            value={paymentInfo.cardName}
                            onChange={handlePaymentInfoChange}
                            className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              name="expiryDate"
                              placeholder="MM/YY"
                              value={paymentInfo.expiryDate}
                              onChange={handlePaymentInfoChange}
                              className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              name="cvv"
                              placeholder="123"
                              value={paymentInfo.cvv}
                              onChange={handlePaymentInfoChange}
                              className="border-pharmacy-primary/20 focus-visible:ring-pharmacy-primary"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "paypal" && (
                      <div className="mt-4 rounded-md bg-pharmacy-light/50 p-4 text-center">
                        <p>You will be redirected to PayPal to complete your payment.</p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-pharmacy-primary/20 text-pharmacy-primary"
                      onClick={() => setCurrentStep("shipping")}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Shipping
                    </Button>
                    <Button
                      type="submit"
                      className="bg-pharmacy-primary hover:bg-pharmacy-dark"
                      disabled={isProcessing}
                    >
                      {isProcessing ? "Processing..." : "Place Order"}
                      {!isProcessing && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="confirmation">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
                  <CardDescription>
                    Thank you for your order. Your order number is <span className="font-bold">{orderId}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-md bg-pharmacy-light/50 p-4">
                    <h3 className="mb-2 font-medium">Order Summary</h3>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span>
                            {item.name} x {item.quantity}
                          </span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <Separator />
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>${shipping.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md bg-pharmacy-light/50 p-4">
                    <h3 className="mb-2 font-medium">Shipping Information</h3>
                    <p>{shippingInfo.fullName}</p>
                    <p>{shippingInfo.address}</p>
                    <p>
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                    </p>
                    <p>{shippingInfo.phone}</p>
                  </div>

                  <div className="rounded-md bg-pharmacy-light/50 p-4">
                    <h3 className="mb-2 font-medium">Delivery Information</h3>
                    <div className="flex items-center">
                      <Truck className="mr-2 h-4 w-4 text-pharmacy-primary" />
                      <span>
                        {shippingMethod === "standard"
                          ? "Standard Shipping (3-5 business days)"
                          : "Express Shipping (1-2 business days)"}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Link href="/orders">
                    <Button className="bg-pharmacy-primary hover:bg-pharmacy-dark">View My Orders</Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-10 w-10 overflow-hidden rounded-md">
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                    </div>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <Separator />
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
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <p className="text-sm">
                If you have any questions about your order, please contact our customer support team.
              </p>
              <p className="text-sm font-medium">Email: support@medimart.com</p>
              <p className="text-sm font-medium">Phone: +1 (555) 123-4567</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
