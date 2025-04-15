"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

type CartItem = {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
  image: string
}

type CartContextType = {
  items: CartItem[]
  itemCount: number
  addItem: (item: CartItem) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  isLoading: boolean
  proceedToCheckout: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Local storage key for guest cart
const LOCAL_STORAGE_CART_KEY = "medimart-guest-cart"

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  // Calculate total number of items in cart
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  // Load cart data when component mounts or session changes
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true)

      if (status === "loading") return

      try {
        if (session) {
          // User is logged in, fetch cart from API
          await fetchUserCart()
        } else {
          // User is not logged in, load from local storage
          loadGuestCart()
        }
      } catch (error) {
        console.error("Error loading cart:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCart()
  }, [session, status])

  // Fetch authenticated user's cart from API
  const fetchUserCart = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate it with local storage
      const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY)
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error("Error fetching user cart:", error)
    }
  }

  // Load guest cart from local storage
  const loadGuestCart = () => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem(LOCAL_STORAGE_CART_KEY)
      if (savedCart) {
        try {
          setItems(JSON.parse(savedCart))
        } catch (e) {
          console.error("Error parsing cart from local storage:", e)
          localStorage.removeItem(LOCAL_STORAGE_CART_KEY)
        }
      }
    }
  }

  // Save cart to local storage
  const saveCart = (cartItems: CartItem[]) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(cartItems))
    }
  }

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.productId === item.productId)

      let updatedItems
      if (existingItemIndex >= 0) {
        // Update existing item
        updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += item.quantity
      } else {
        // Add new item with a temporary ID
        const newItem = { ...item, id: `temp-${Date.now()}` }
        updatedItems = [...prevItems, newItem]
      }

      // Save to local storage
      saveCart(updatedItems)
      return updatedItems
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === id || item.productId === id ? { ...item, quantity } : item,
      )
      saveCart(updatedItems)
      return updatedItems
    })
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.id !== id && item.productId !== id)
      saveCart(updatedItems)
      return updatedItems
    })
  }

  const clearCart = () => {
    setItems([])
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_CART_KEY)
    }
  }

  // Function to handle checkout process
  const proceedToCheckout = () => {
    if (!session) {
      // If user is not logged in, redirect to sign in page with return URL
      toast({
        title: "Sign in required",
        description: "Please sign in to complete your purchase",
      })
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent("/checkout")}`)
    } else {
      // User is logged in, proceed to checkout
      router.push("/checkout")
    }
  }

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        isLoading,
        proceedToCheckout,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
