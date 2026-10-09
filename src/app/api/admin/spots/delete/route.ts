import { NextResponse } from 'next/server';
import { deletePlaceFromMockData } from '@/lib/spotsAdminService';
import { deletePlaceFromSupabase } from '@/lib/placesSupabaseService';

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'ID du lieu manquant' },
        { status: 400 }
      );
    }

    // 1. Supprimer localement
    deletePlaceFromMockData(id);

    // 2. Supprimer dans Supabase
    try {
      await deletePlaceFromSupabase(id);
    } catch (dbErr) {
      console.warn('Note: Could not delete from Supabase yet:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Lieu ${id} supprimé avec succès.`
    });
  } catch (err: any) {
    console.error('Error in delete spot route:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
