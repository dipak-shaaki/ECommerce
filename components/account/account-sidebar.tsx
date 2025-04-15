"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { User, Package, MapPin, FileText, Settings, Heart, LogOut, CreditCard } from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

const menuItems = [
  {
    title: "Overview",
    href: "/account",
    icon: User,
  },
  {
    title: "Orders",
    href: "/account/orders",
    icon: Package,
  },
  {
    title: "Addresses",
    href: "/account/addresses",
    icon: MapPin,
  },
  {
    title: "Prescriptions",
    href: "/account/prescriptions",
    icon: FileText,
  },
  {
    title: "Payment Methods",
    href: "/account/payment-methods",
    icon: CreditCard,
  },
  {
    title: "Wishlist",
    href: "/account/wishlist",
    icon: Heart,
  },
  {
    title: "Settings",
    href: "/account/settings",
    icon: Settings,
  },
]

export function AccountSidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="px-2 text-lg font-semibold tracking-tight text-pharmacy-dark">My Account</h2>
        <p className="px-2 text-sm text-muted-foreground">Manage your account and preferences</p>
      </div>
      <nav className="flex flex-col space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-pharmacy-light hover:text-pharmacy-dark",
              pathname === item.href ? "bg-pharmacy-light text-pharmacy-dark font-medium" : "text-muted-foreground",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
        <Button
          variant="ghost"
          className="flex items-center justify-start gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </nav>
    </div>
  )
}
