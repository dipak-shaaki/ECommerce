import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { generateOrderNumber } from "@/lib/utils"

export async function GET(request: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const page = searchParams.get("page") ? Number.parseInt(searchParams.get("page")!) : 1
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 10

    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}

    // If user is not admin, only show their orders
    if (session.user.role !== "ADMIN") {
      where.userId = userId
    }

    if (status) {
      where.status = status.toUpperCase()
    }

    // Get orders with pagination
    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true,
              },
            },
          },
        },
        address: true,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    })

    // Get total count for pagination
    const total = await prisma.order.count({ where })

    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
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
    const { addressId, shippingMethod, paymentMethod, notes, prescriptionIds = [] } = body

    if (!addressId || !shippingMethod || !paymentMethod) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if address exists and belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    })

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

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

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    // Check if any product requires prescription
    const productsRequiringPrescription = cart.items.filter((item) => item.product.requiresPrescription)

    if (productsRequiringPrescription.length > 0 && prescriptionIds.length === 0) {
      return NextResponse.json({ error: "Prescription required for some products" }, { status: 400 })
    }

    // Verify prescriptions belong to user and are approved
    if (prescriptionIds.length > 0) {
      const prescriptions = await prisma.prescription.findMany({
        where: {
          id: { in: prescriptionIds },
          userId,
        },
      })

      if (prescriptions.length !== prescriptionIds.length) {
        return NextResponse.json({ error: "One or more prescriptions not found" }, { status: 404 })
      }

      const unapprovedPrescriptions = prescriptions.filter((prescription) => prescription.status !== "APPROVED")

      if (unapprovedPrescriptions.length > 0) {
        return NextResponse.json({ error: "One or more prescriptions are not approved" }, { status: 400 })
      }
    }

    // Calculate order totals
    const subtotal = cart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0)

    // Set shipping cost based on method
    let shippingCost = 4.99
    if (shippingMethod === "express") {
      shippingCost = 9.99
    }

    // Calculate tax (example: 8%)
    const taxRate = 0.08
    const tax = subtotal * taxRate

    // Calculate total
    const total = subtotal + shippingCost + tax

    // Start a transaction
    const order = await prisma.$transaction(async (prisma) => {
      // Create order
      const newOrder = await prisma.order.create({
        data: {
          orderNumber: generateOrderNumber(),
          userId,
          addressId,
          shippingMethod,
          paymentMethod,
          shippingCost,
          subtotal,
          tax,
          total,
          notes,
          status: "PENDING",
          paymentStatus: "PENDING",
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              name: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              requiresPrescription: item.product.requiresPrescription,
            })),
          },
          prescriptions: {
            create: prescriptionIds.map((prescriptionId) => ({
              prescriptionId,
            })),
          },
        },
        include: {
          items: true,
          address: true,
          prescriptions: {
            include: {
              prescription: true,
            },
          },
        },
      })

      // Update inventory
      for (const item of cart.items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            inventory: {
              decrement: item.quantity,
            },
          },
        })
      }

      // Clear cart
      await prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      })

      return newOrder
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
