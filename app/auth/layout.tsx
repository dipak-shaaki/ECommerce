import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Authentication - MediMart",
  description: "Sign in or create an account with MediMart",
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
