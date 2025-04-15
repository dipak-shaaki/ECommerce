import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "PHARMACIST") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Get dashboard statistics
    const totalUsers = await prisma.user.count({
      where: { role: "CUSTOMER" },
    })

    const totalProducts = await prisma.product.count()

    const totalOrders = await prisma.order.count()

    const totalRevenue = await prisma.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        paymentStatus: "PAID",
      },
    })

    // Get low inventory products
    const lowInventoryProducts = await prisma.product.findMany({
      where: {
        inventory: {
          lt: 10,
        },
      },
      orderBy: {
        inventory: "asc",
      },
      take: 5,
    })

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })

    // Get pending prescriptions
    const pendingPrescriptions = await prisma.prescription.count({
      where: {
        status: "PENDING",
      },
    })

    return NextResponse.json({
      statistics: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue._sum.total || 0,
        pendingPrescriptions,
      },
      lowInventoryProducts,
      recentOrders,
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
