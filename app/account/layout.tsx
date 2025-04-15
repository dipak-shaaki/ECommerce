import type React from "react"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { AccountSidebar } from "@/components/account/account-sidebar"

export const metadata: Metadata = {
  title: "My Account - MediMart",
  description: "Manage your MediMart account, orders, prescriptions and more",
}

export default async function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Check if user is authenticated
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/signin?callbackUrl=/account")
  }

  return (
    <div className="container py-10">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <AccountSidebar />
        <div className="space-y-6">{children}</div>
      </div>
    </div>
  )
}
