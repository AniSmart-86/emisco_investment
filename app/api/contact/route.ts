import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sendContactFeedbackEmail } from '@/lib/email-service';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(5),
  message: z.string().min(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = contactSchema.parse(body);

    await sendContactFeedbackEmail(data);

    return NextResponse.json({
      success: true,
      message: 'Your message has been received. We will get back to you shortly.',
    });
  } catch (error) {
    console.error('CONTACT API ERROR:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send message. Please try again later.' },
      { status: 500 }
    );
  }
}
