import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function PUT(request: Request, { params }: { params: { itemId: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const itemId = params.itemId
    const body = await request.json()
    const { quantity } = body

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: "Invalid quantity" }, { status: 400 })
    }

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    })

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    // Check if cart item exists and belongs to user's cart
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
      include: {
        product: true,
      },
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    // Check if product has enough inventory
    if (cartItem.product.inventory < quantity) {
      return NextResponse.json({ error: "Not enough inventory" }, { status: 400 })
    }

    // Update cart item
    const updatedCartItem = await prisma.cartItem.update({
      where: {
        id: itemId,
      },
      data: {
        quantity,
      },
      include: {
        product: true,
      },
    })

    return NextResponse.json(updatedCartItem)
  } catch (error) {
    console.error("Error updating cart item:", error)
    return NextResponse.json({ error: "Failed to update cart item" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { itemId: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const itemId = params.itemId

    // Get user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
    })

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 })
    }

    // Check if cart item exists and belongs to user's cart
    const cartItem = await prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    })

    if (!cartItem) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 })
    }

    // Delete cart item
    await prisma.cartItem.delete({
      where: {
        id: itemId,
      },
    })

    return NextResponse.json({ message: "Cart item removed successfully" })
  } catch (error) {
    console.error("Error removing cart item:", error)
    return NextResponse.json({ error: "Failed to remove cart item" }, { status: 500 })
  }
}
