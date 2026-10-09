import { NextResponse } from 'next/server';
import { saveUpdatedPlace } from '@/lib/spotsAdminService';
import { upsertPlaceInSupabase } from '@/lib/placesSupabaseService';
import { PlaceItem } from '@/types';

export async function POST(request: Request) {
  try {
    const { place } = await request.json();

    if (!place || !place.id || !place.name) {
      return NextResponse.json(
        { error: 'Données du lieu invalides' },
        { status: 400 }
      );
    }

    // 1. Sauvegarde locale mock
    saveUpdatedPlace(place as PlaceItem);

    // 2. Sauvegarde Supabase
    try {
      await upsertPlaceInSupabase(place as PlaceItem);
    } catch (dbErr) {
      console.warn('Note: Could not update in Supabase yet:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Le lieu "${place.name}" a été mis à jour avec succès !`,
      place
    });
  } catch (err: any) {
    console.error('Error in update spot route:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
