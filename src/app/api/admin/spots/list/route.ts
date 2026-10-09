import { NextResponse } from 'next/server';
import { INITIAL_PLACES } from '@/data/mockData';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      places: INITIAL_PLACES
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
