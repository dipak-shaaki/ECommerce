import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export function MobileNav() {
  return (
    <div className="flex flex-col gap-6 p-4">
      <form>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search medications..." className="w-full bg-background pl-8" />
        </div>
      </form>
      <nav className="grid gap-2 text-sm font-medium">
        <Link href="/products" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted">
          All Products
        </Link>
        <Link href="/categories" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted">
          Categories
        </Link>
        <Link href="/prescriptions" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted">
          Upload Prescription
        </Link>
        <Link href="/orders" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted">
          My Orders
        </Link>
        <Link href="/account" className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-muted">
          My Account
        </Link>
      </nav>
    </div>
  )
}
