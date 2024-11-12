// /app/api/create-checkout-session/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { price, productName, metadata = {} } = body;

    console.log('📦 Creating checkout session with:', {
      price,
      productName,
      metadata
    });

    if (!productName || typeof price !== 'number') {
      return NextResponse.json(
        { error: 'Price and product name are required' },
        { status: 400 }
      );
    }

    const params: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: Math.round(price * 100),
            product_data: {
              name: productName,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
      metadata: { ...metadata, productName },
    };

    console.log('🔧 Stripe session params:', params);

    const session = await stripe.checkout.sessions.create(params);
    console.log('✅ Checkout session created:', session.id);
    console.log('📋 Session metadata:', session.metadata);

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
    });

  } catch (error) {
    console.error('❌ Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Error creating checkout session' },
      { status: 500 }
    );
  }
}