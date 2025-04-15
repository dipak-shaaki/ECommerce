// This is a mock database service
// In a real application, you would use a real database like MongoDB, PostgreSQL, etc.

// Product types
export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category: string
  prescription: boolean
  stock: number
}

// User types
export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "customer" | "pharmacist"
}

// Order types
export interface OrderItem {
  productId: number
  quantity: number
  price: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: Date
  updatedAt: Date
}

// Prescription types
export interface Prescription {
  id: string
  userId: string
  image: string
  status: "pending" | "approved" | "rejected"
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Mock data
const products: Product[] = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    description: "Pain reliever and fever reducer",
    price: 5.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Over-the-Counter",
    prescription: false,
    stock: 150,
  },
  {
    id: 2,
    name: "Vitamin C 1000mg",
    description: "Immune system support",
    price: 12.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Vitamins & Supplements",
    prescription: false,
    stock: 200,
  },
  {
    id: 3,
    name: "Amoxicillin 500mg",
    description: "Antibiotic for bacterial infections",
    price: 15.99,
    image: "/placeholder.svg?height=200&width=200",
    category: "Prescription",
    prescription: true,
    stock: 80,
  },
  // Add more products as needed
]

const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "user@example.com",
    role: "customer",
  },
  {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  },
  // Add more users as needed
]

const orders: Order[] = [
  {
    id: "ord-1",
    userId: "1",
    items: [
      { productId: 1, quantity: 2, price: 5.99 },
      { productId: 2, quantity: 1, price: 12.99 },
    ],
    total: 24.97,
    status: "delivered",
    createdAt: new Date("2023-06-24"),
    updatedAt: new Date("2023-06-26"),
  },
  // Add more orders as needed
]

const prescriptions: Prescription[] = [
  {
    id: "pres-1",
    userId: "1",
    image: "/placeholder.svg?height=400&width=300",
    status: "approved",
    notes: "Prescription for Amoxicillin 500mg",
    createdAt: new Date("2023-06-20"),
    updatedAt: new Date("2023-06-21"),
  },
  // Add more prescriptions as needed
]

// Database service
export const db = {
  // Product methods
  getProducts: () => products,
  getProductById: (id: number) => products.find((p) => p.id === id),
  getProductsByCategory: (category: string) => products.filter((p) => p.category === category),
  searchProducts: (query: string) =>
    products.filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()),
    ),

  // User methods
  getUserById: (id: string) => users.find((u) => u.id === id),
  getUserByEmail: (email: string) => users.find((u) => u.email === email),

  // Order methods
  getOrders: () => orders,
  getOrderById: (id: string) => orders.find((o) => o.id === id),
  getOrdersByUserId: (userId: string) => orders.filter((o) => o.userId === userId),

  // Prescription methods
  getPrescriptions: () => prescriptions,
  getPrescriptionById: (id: string) => prescriptions.find((p) => p.id === id),
  getPrescriptionsByUserId: (userId: string) => prescriptions.filter((p) => p.userId === userId),
}
