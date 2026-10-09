import { NextResponse } from 'next/server';
import { getAllPlaces } from '@/lib/placesSupabaseService';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const places = await getAllPlaces();
    return NextResponse.json({
      success: true,
      spots: places
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
