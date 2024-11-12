// /app/api/keyauth/route.ts
import { NextResponse } from 'next/server';
import { generateLicense } from '../utils/generateLicense';

export const dynamic = "force-dynamic"; // This allows dynamic handling of the route

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const level = searchParams.get('level');

  if (!level) {
    return NextResponse.json({ error: 'Level parameter is required' }, { status: 400 });
  }

  try {
    const licenseKey = await generateLicense(level);
    return NextResponse.json({ success: true, licenseKey });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
