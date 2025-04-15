import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"
import { sendPasswordResetEmail } from "@/lib/email"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Don't reveal if user exists or not for security reasons
    if (!user) {
      return NextResponse.json({ message: "If your email is registered, you will receive a password reset link" })
    }

    // Generate a unique reset token
    const resetToken = uuidv4()
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Store the reset token in the database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // Send password reset email
    await sendPasswordResetEmail(user.email, resetToken)

    return NextResponse.json({ message: "If your email is registered, you will receive a password reset link" })
  } catch (error) {
    console.error("Error in forgot password:", error)
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
