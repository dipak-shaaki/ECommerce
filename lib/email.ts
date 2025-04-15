// This is a mock email service
// In a real application, you would use a service like SendGrid, Mailgun, or AWS SES

export async function sendPasswordResetEmail(email: string, token: string) {
  // In a real application, you would send an actual email
  // For now, we'll just log the reset link
  const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`

  console.log(`Password reset email sent to ${email}`)
  console.log(`Reset link: ${resetLink}`)

  // Return a resolved promise to simulate successful email sending
  return Promise.resolve()
}
