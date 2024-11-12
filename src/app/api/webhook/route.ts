// /app/api/webhook/route.ts
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { generateLicense } from '../../utils/generateLicense';
import { sendEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  console.log('📨 Received webhook');

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('❌ Missing signature or webhook secret');
    return NextResponse.json(
      { error: 'Missing stripe signature or webhook secret' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log('✅ Webhook signature verified');
    console.log('🎯 Event type:', event.type);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', (err as Error).message);
    return NextResponse.json(
      { error: `Webhook Error: ${(err as Error).message}` },
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    console.log('💫 Processing completed checkout session:', session.id);
    console.log('📋 Session metadata:', session.metadata);

    try {
      const customerEmail = session.customer_details?.email;
      const keyAuthLevel = session.metadata?.keyAuthLevel;
      const productName = session.metadata?.productName;
      
      console.log('📧 Customer email:', customerEmail);
      console.log('🔑 KeyAuth level:', keyAuthLevel);
      console.log('🏷️ Product name:', productName);

      if (!customerEmail || !keyAuthLevel || !productName) {
        throw new Error('Missing required metadata');
      }

      // Generate license key
      console.log('🔄 Generating license key...');
      const licenseKey = await generateLicense(keyAuthLevel);
      console.log('✨ Generated license key:', licenseKey);

      // Send email
      console.log('📤 Sending email...');
      await sendEmail({
        customerEmail,
        productName,
        licenseKey,
        orderId: session.id
      });
      console.log('📬 Email sent successfully');

      return NextResponse.json({ 
        received: true,
        status: 'Success',
        licenseKey,
        customerEmail,
        productName
      });
      
    } catch (error) {
      console.error('❌ Error processing webhook:', error);
      return NextResponse.json({ 
        received: true,
        error: 'Failed to process order'
      }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
