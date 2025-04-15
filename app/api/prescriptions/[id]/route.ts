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
    const prescriptionId = params.id

    // Build query conditions
    const where: any = { id: prescriptionId }

    // If user is not admin or pharmacist, only allow them to view their own prescriptions
    if (session.user.role !== "ADMIN" && session.user.role !== "PHARMACIST") {
      where.userId = userId
    }

    // Get prescription details
    const prescription = await prisma.prescription.findFirst({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 })
    }

    return NextResponse.json(prescription)
  } catch (error) {
    console.error("Error fetching prescription:", error)
    return NextResponse.json({ error: "Failed to fetch prescription" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Only admins and pharmacists can update prescription status
    if (session.user.role !== "ADMIN" && session.user.role !== "PHARMACIST") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const prescriptionId = params.id
    const body = await request.json()
    const { status, notes } = body

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    // Check if prescription exists
    const prescription = await prisma.prescription.findUnique({
      where: { id: prescriptionId },
    })

    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 })
    }

    // Update prescription
    const updatedPrescription = await prisma.prescription.update({
      where: { id: prescriptionId },
      data: {
        status: status.toUpperCase(),
        notes: notes || prescription.notes,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json(updatedPrescription)
  } catch (error) {
    console.error("Error updating prescription:", error)
    return NextResponse.json({ error: "Failed to update prescription" }, { status: 500 })
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
    const prescriptionId = params.id

    // Build query conditions
    const where: any = { id: prescriptionId }

    // If user is not admin, only allow them to delete their own prescriptions
    if (session.user.role !== "ADMIN") {
      where.userId = userId
    }

    // Check if prescription exists
    const prescription = await prisma.prescription.findFirst({
      where,
    })

    if (!prescription) {
      return NextResponse.json({ error: "Prescription not found" }, { status: 404 })
    }

    // Delete prescription
    await prisma.prescription.delete({
      where: { id: prescriptionId },
    })

    return NextResponse.json({ message: "Prescription deleted successfully" })
  } catch (error) {
    console.error("Error deleting prescription:", error)
    return NextResponse.json({ error: "Failed to delete prescription" }, { status: 500 })
  }
}
