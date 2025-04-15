"use client"

import Link from "next/link"
import { ShoppingCart, Search, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { MobileNav } from "@/components/mobile-nav"
import { useCart } from "@/contexts/cart-context"
import { Badge } from "@/components/ui/badge"

export function SiteHeader() {
  const { itemCount } = useCart()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <MobileNav />
          </SheetContent>
        </Sheet>
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-xl font-bold text-pharmacy-primary">MediMart</span>
        </Link>
        <nav className="hidden md:flex md:items-center md:gap-5 md:text-sm md:font-medium">
          <Link href="/products" className="transition-colors hover:text-pharmacy-primary">
            All Products
          </Link>
          <Link href="/categories" className="transition-colors hover:text-pharmacy-primary">
            Categories
          </Link>
          <Link href="/prescriptions" className="transition-colors hover:text-pharmacy-primary">
            Upload Prescription
          </Link>
          <Link href="/orders" className="transition-colors hover:text-pharmacy-primary">
            My Orders
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <form className="hidden md:flex md:w-80 lg:w-96">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search medications..."
                className="w-full rounded-lg bg-background pl-8 md:w-full"
              />
            </div>
          </form>
          <Link href="/auth/signin">
            <Button variant="ghost" size="icon" aria-label="Account">
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-pharmacy-primary p-0 text-xs text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </Badge>
              )}
              <span className="sr-only">Cart</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
