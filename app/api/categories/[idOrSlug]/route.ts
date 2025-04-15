import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import slugify from "slugify"

export async function GET(request: Request, { params }: { params: { idOrSlug: string } }) {
  try {
    const idOrSlug = params.idOrSlug

    const category = await prisma.category.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        products: true,
      },
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { idOrSlug: string } }) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const idOrSlug = params.idOrSlug
    const body = await request.json()
    const { name, description, image } = body

    // Find the category
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    })

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Generate new slug if name is changed
    let slug = existingCategory.slug
    if (name && name !== existingCategory.name) {
      slug = slugify(name, { lower: true })

      // Check if slug is already in use by another category
      const categoryWithSlug = await prisma.category.findFirst({
        where: {
          slug,
          id: { not: existingCategory.id },
        },
      })

      if (categoryWithSlug) {
        return NextResponse.json({ error: "Category with this name already exists" }, { status: 409 })
      }
    }

    // Update category
    const updatedCategory = await prisma.category.update({
      where: { id: existingCategory.id },
      data: {
        name: name || existingCategory.name,
        slug,
        description,
        image,
      },
    })

    return NextResponse.json(updatedCategory)
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { idOrSlug: string } }) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const idOrSlug = params.idOrSlug

    // Find the category
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        products: {
          select: { id: true },
        },
      },
    })

    if (!existingCategory) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    // Check if category has products
    if (existingCategory.products.length > 0) {
      return NextResponse.json({ error: "Cannot delete category with associated products" }, { status: 400 })
    }

    // Delete category
    await prisma.category.delete({
      where: { id: existingCategory.id },
    })

    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
