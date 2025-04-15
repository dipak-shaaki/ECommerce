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
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const page = searchParams.get("page") ? Number.parseInt(searchParams.get("page")!) : 1
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 10

    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}

    // If user is not admin or pharmacist, only show their prescriptions
    if (session.user.role !== "ADMIN" && session.user.role !== "PHARMACIST") {
      where.userId = userId
    }

    if (status) {
      where.status = status.toUpperCase()
    }

    // Get prescriptions with pagination
    const prescriptions = await prisma.prescription.findMany({
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
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    })

    // Get total count for pagination
    const total = await prisma.prescription.count({ where })

    return NextResponse.json({
      prescriptions,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching prescriptions:", error)
    return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 })
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
    const { image, notes } = body

    if (!image) {
      return NextResponse.json({ error: "Prescription image is required" }, { status: 400 })
    }

    // Create prescription
    const prescription = await prisma.prescription.create({
      data: {
        userId,
        image,
        notes,
        status: "PENDING",
      },
    })

    return NextResponse.json(prescription, { status: 201 })
  } catch (error) {
    console.error("Error uploading prescription:", error)
    return NextResponse.json({ error: "Failed to upload prescription" }, { status: 500 })
  }
}
