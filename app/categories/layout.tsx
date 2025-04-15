import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Categories - MediMart",
  description: "Browse our wide range of healthcare products by category",
}

export default function CategoriesLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return <>{children}</>
}
