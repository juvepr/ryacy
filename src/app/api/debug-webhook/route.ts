// /app/api/debug-webhook/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { sendEmail } from '@/lib/email';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

async function generateLicense(keyAuthLevel: string): Promise<string> {
  try {
    const sellerKey = process.env.KEYAUTH_SELLER_KEY;
    const params = new URLSearchParams({
      sellerkey: sellerKey || '',
      type: 'add',
      format: 'JSON',
      expiry: '0',
      mask: '******-******-******',
      level: keyAuthLevel,
      amount: '1',
      character: '1',
      note: `Generated from Stripe purchase`
    });

    const url = `https://keyauth.win/api/seller/?${params.toString()}`;
    
    console.log('🔑 Making KeyAuth request with level:', keyAuthLevel);
    
    const headers = new Headers();
    headers.append("User-Agent", "Apidog/1.0.0 (https://apidog.com)");

    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
      redirect: 'follow'
    });

    if (!response.ok) {
      throw new Error(`KeyAuth HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('🔑 Raw KeyAuth Response:', data);

    // Handle different possible response formats
    if (data.success === true) {
      if (data.key) return data.key;
      if (data.info) return data.info;
      if (data.message && data.message.includes('Successfully')) {
        const match = data.message.match(/Key: ([A-Z0-9-]+)/);
        if (match) return match[1];
      }
    }
    
    console.error('❌ Unable to extract license key from response:', data);
    throw new Error('Could not extract license key from response');
  } catch (error) {
    console.error('❌ KeyAuth Error:', error);
    throw error;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    console.log('🔍 Debug webhook called with session ID:', sessionId);

    if (!sessionId) {
      return NextResponse.json({ 
        success: false, 
        error: 'No session ID provided' 
      }, { status: 400 });
    }

    // Retrieve the session
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    console.log('💳 Stripe session:', {
      id: session.id,
      customerEmail: session.customer_details?.email,
      metadata: session.metadata,
      paymentStatus: session.payment_status
    });

    const customerEmail = session.customer_details?.email;
    const keyAuthLevel = session.metadata?.keyAuthLevel;
    const productName = session.metadata?.productName;

    // Validate required data
    if (!customerEmail || !keyAuthLevel || !productName) {
      const error = {
        success: false,
        error: 'Missing required data',
        received: { customerEmail, keyAuthLevel, productName }
      };
      console.error('❌ Validation failed:', error);
      return NextResponse.json(error, { status: 400 });
    }

    // Generate license key
    let licenseKey: string;
    try {
      licenseKey = await generateLicense(keyAuthLevel);
      console.log('✅ Successfully generated license key:', licenseKey);
    } catch (error) {
      console.error('❌ License generation failed:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to generate license key',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }

    // Send email
    try {
      await sendEmail({
        customerEmail,
        productName,
        licenseKey,
        orderId: session.id
      });
      console.log('📧 Email sent successfully');
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      // Continue despite email failure
    }

    // Return success response
    const responseData = {
      success: true,
      data: {
        sessionId: session.id,
        customerEmail,
        productName,
        keyAuthLevel,
        licenseKey,
        paymentStatus: session.payment_status,
        metadata: session.metadata
      }
    };

    console.log('📤 Sending response:', responseData);
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('❌ Debug webhook error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}