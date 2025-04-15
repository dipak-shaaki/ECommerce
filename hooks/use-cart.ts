"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

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

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const itemCount = items.reduce((total, item) => total + item.quantity, 0)

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.productId === item.productId)

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += item.quantity
        return updatedItems
      } else {
        return [...prevItems, item]
      }
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prevItems) => prevItems.map((item) => (item.productId === id ? { ...item, quantity } : item)))
  }

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.productId !== id))
  }

  const clearCart = () => {
    setItems([])
  }

  const proceedToCheckout = () => {
    // Placeholder for checkout logic
    console.log("Proceeding to checkout")
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
