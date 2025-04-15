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

    // Get user's addresses
    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: {
        isDefault: "desc",
      },
    })

    return NextResponse.json(addresses)
  } catch (error) {
    console.error("Error fetching addresses:", error)
    return NextResponse.json({ error: "Failed to fetch addresses" }, { status: 500 })
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
    const { fullName, address, city, state, zipCode, country, phone, isDefault } = body

    if (!fullName || !address || !city || !zipCode || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // If this is the first address or isDefault is true, update all other addresses to not be default
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      })
    }

    // Check if this is the first address
    const addressCount = await prisma.address.count({
      where: { userId },
    })

    // Create address
    const newAddress = await prisma.address.create({
      data: {
        userId,
        fullName,
        address,
        city,
        state,
        zipCode,
        country: country || "United States",
        phone,
        isDefault: isDefault || addressCount === 0, // Make it default if it's the first address
      },
    })

    return NextResponse.json(newAddress, { status: 201 })
  } catch (error) {
    console.error("Error creating address:", error)
    return NextResponse.json({ error: "Failed to create address" }, { status: 500 })
  }
}
