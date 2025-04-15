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
    const addressId = params.id

    // Get address
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    })

    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    return NextResponse.json(address)
  } catch (error) {
    console.error("Error fetching address:", error)
    return NextResponse.json({ error: "Failed to fetch address" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const addressId = params.id
    const body = await request.json()
    const { fullName, address, city, state, zipCode, country, phone, isDefault } = body

    // Check if address exists and belongs to user
    const existingAddress = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId,
      },
    })

    if (!existingAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 })
    }

    // If setting as default, update all other addresses to not be default
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userId,
          id: { not: addressId },
        },
        data: { isDefault: false },
      })
    }

    // Update address
    const updatedAddress = await prisma.address.update({
      where: { id: addressId },
      data: {
        fullName,
        address,
        city,
        state,
        zipCode,
        country,
        phone,
        isDefault,
      },
    })

    return NextResponse.json(updatedAddress)
  } catch (error) {
    console.error("Error updating address:", error)
    return NextResponse.json({ error: "Failed to update address" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const addressId = params.id

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

    // Check if address is used in any orders
    const ordersWithAddress = await prisma.order.count({
      where: { addressId },
    })

    if (ordersWithAddress > 0) {
      return NextResponse.json({ error: "Cannot delete address used in orders" }, { status: 400 })
    }

    // Delete address
    await prisma.address.delete({
      where: { id: addressId },
    })

    // If this was the default address, set another address as default
    if (address.isDefault) {
      const anotherAddress = await prisma.address.findFirst({
        where: { userId },
      })

      if (anotherAddress) {
        await prisma.address.update({
          where: { id: anotherAddress.id },
          data: { isDefault: true },
        })
      }
    }

    return NextResponse.json({ message: "Address deleted successfully" })
  } catch (error) {
    console.error("Error deleting address:", error)
    return NextResponse.json({ error: "Failed to delete address" }, { status: 500 })
  }
}
