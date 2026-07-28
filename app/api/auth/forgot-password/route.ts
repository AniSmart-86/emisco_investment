import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { sendPasswordResetOtpEmail } from '@/lib/email-service';
import bcrypt from 'bcryptjs';

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Return success anyway so we don't disclose whether email exists
      return NextResponse.json({
        message: 'If an account exists with this email, an OTP has been sent.',
      });
    }

    // Generate random 6-digit OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(rawOtp, 10);
    const expiresAt = new Date(Date.now() + 20 * 60 * 1000); // 20 minutes expiry

    // Delete existing unused OTPs for this user
    await prisma.passwordResetOtp.deleteMany({
      where: { userId: user.id },
    });

    // Create new OTP record
    await prisma.passwordResetOtp.create({
      data: {
        userId: user.id,
        otp: hashedOtp,
        expiresAt,
      },
    });

    // Send Email
    await sendPasswordResetOtpEmail(user.email, user.name, rawOtp);

    return NextResponse.json({
      message: 'OTP sent to your email. Valid for 20 minutes.',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Failed to process password reset. Please try again.' }, { status: 500 });
  }
}
