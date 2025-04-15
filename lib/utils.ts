import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

export function generateOrderNumber(): string {
  const prefix = "ORD"
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `${prefix}-${timestamp}${random}`
}

export function getInitials(name: string): string {
  if (!name) return ""
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

export function calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
  if (!originalPrice || !discountedPrice || originalPrice <= 0) return 0
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100
  return Math.round(discount)
}
