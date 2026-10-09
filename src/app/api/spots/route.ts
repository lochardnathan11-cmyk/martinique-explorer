import { NextResponse } from 'next/server';
import { INITIAL_PLACES } from '@/data/mockData';

export async function GET() {
  return NextResponse.json({
    success: true,
    spots: INITIAL_PLACES
  });
}
