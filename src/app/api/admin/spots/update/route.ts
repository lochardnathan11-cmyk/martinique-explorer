import { NextResponse } from 'next/server';
import { saveUpdatedPlace } from '@/lib/spotsAdminService';
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

    const saved = saveUpdatedPlace(place as PlaceItem);
    if (!saved) {
      return NextResponse.json(
        { error: `Impossible de sauvegarder le lieu ${place.id}` },
        { status: 500 }
      );
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
