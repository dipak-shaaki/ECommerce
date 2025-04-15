import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Products - MediMart",
  description: "Browse our wide range of medications and healthcare products",
}

export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
