// /app/api/test-email/route.ts
import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, productName, licenseKey, orderId } = body;

    if (!email || !productName || !licenseKey || !orderId) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { 
        status: 400 
      });
    }

    await sendEmail({
      customerEmail: email,
      productName,
      licenseKey,
      orderId
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully' 
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    }, { 
      status: 500 
    });
  }
}