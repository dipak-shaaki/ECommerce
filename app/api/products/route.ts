import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get("categoryId")
    const categorySlug = searchParams.get("categorySlug")
    const query = searchParams.get("query")
    const minPrice = searchParams.get("minPrice") ? Number.parseFloat(searchParams.get("minPrice")!) : undefined
    const maxPrice = searchParams.get("maxPrice") ? Number.parseFloat(searchParams.get("maxPrice")!) : undefined
    const requiresPrescription =
      searchParams.get("requiresPrescription") === "true"
        ? true
        : searchParams.get("requiresPrescription") === "false"
          ? false
          : undefined
    const page = searchParams.get("page") ? Number.parseInt(searchParams.get("page")!) : 1
    const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : 10

    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (categorySlug) {
      where.category = {
        slug: categorySlug,
      }
    }

    if (query) {
      where.OR = [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ]
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) {
        where.price.gte = minPrice
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice
      }
    }

    if (requiresPrescription !== undefined) {
      where.requiresPrescription = requiresPrescription
    }

    // Get products with pagination
    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
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
    const total = await prisma.product.count({ where })

    return NextResponse.json({
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "PHARMACIST") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await request.json()
    const {
      name,
      description,
      price,
      compareAtPrice,
      sku,
      barcode,
      inventory,
      requiresPrescription,
      images,
      categoryId,
    } = body

    // Validate required fields
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        compareAtPrice,
        sku,
        barcode,
        inventory,
        requiresPrescription: requiresPrescription || false,
        images: images || [],
        categoryId,
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
