import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get user's cart with items
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    // If cart doesn't exist, create one
    if (!cart) {
      const newCart = await prisma.cart.create({
        data: {
          userId,
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      })
      return NextResponse.json(newCart)
    }

    return NextResponse.json(cart)
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const body = await request.json()
    const { productId, quantity } = body

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid product or quantity" }, { status: 400 })
    }

    // Check if product exists and has enough inventory
    const product = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    if (product.inventory < quantity) {
      return NextResponse.json({ error: "Not enough inventory" }, { status: 400 })
    }

    // Get or create user's cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
        },
      })
    }

    // Check if item already exists in cart
    const existingCartItem = await prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
    })

    if (existingCartItem) {
      // Update existing cart item
      const updatedCartItem = await prisma.cartItem.update({
        where: {
          id: existingCartItem.id,
        },
        data: {
          quantity: existingCartItem.quantity + quantity,
        },
        include: {
          product: true,
        },
      })
      return NextResponse.json(updatedCartItem)
    } else {
      // Create new cart item
      const newCartItem = await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
        include: {
          product: true,
        },
      })
      return NextResponse.json(newCartItem)
    }
  } catch (error) {
    console.error("Error adding item to cart:", error)
    return NextResponse.json({ error: "Failed to add item to cart" }, { status: 500 })
  }
}
