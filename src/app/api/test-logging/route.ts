// test-logging/route.ts (Just for testing console.logs)

import { NextResponse } from 'next/server';

export async function GET() {
  // These will appear in your terminal
  console.log('⭐ Basic log');
  console.info('ℹ️ Info log');
  console.warn('⚠️ Warning log');
  console.error('❌ Error log');
  
  // Log an object
  console.log('📦 Object log:', {
    time: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    sendgridExists: !!process.env.SENDGRID_API_KEY,
    stripeExists: !!process.env.STRIPE_SECRET_KEY
  });

  return NextResponse.json({ status: 'Logs sent to console' });
}