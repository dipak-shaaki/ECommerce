import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const orderId = params.id

    // Build query conditions
    const where: any = { id: orderId }

    // If user is not admin, only allow them to view their own orders
    if (session.user.role !== "ADMIN") {
      where.userId = userId
    }

    // Get order details
    const order = await prisma.order.findFirst({
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
        prescriptions: {
          include: {
            prescription: true,
          },
        },
      },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins and pharmacists can update orders
    if (session.user.role !== "ADMIN" && session.user.role !== "PHARMACIST") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const orderId = params.id
    const body = await request.json()
    const { status, paymentStatus, trackingNumber } = body

    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status ? status.toUpperCase() : undefined,
        paymentStatus: paymentStatus ? paymentStatus.toUpperCase() : undefined,
        trackingNumber,
      },
      include: {
        items: true,
        address: true,
      },
    })

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}
