import { NextResponse } from 'next/server';
import { INITIAL_PLACES } from '@/data/mockData';
import { updateSpotPhotosInMockData } from '@/lib/photoUploadService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { spotId, photoUrl } = body;

    if (!spotId || !photoUrl) {
      return NextResponse.json(
        { error: 'spotId et photoUrl sont requis' },
        { status: 400 }
      );
    }

    const currentSpot = INITIAL_PLACES.find(s => s.id === spotId);
    if (!currentSpot) {
      return NextResponse.json(
        { error: `Lieu introuvable pour l'identifiant: ${spotId}` },
        { status: 404 }
      );
    }

    const existingPhotos = Array.isArray(currentSpot.photos) ? currentSpot.photos : [];
    // Move selected photoUrl to index 0
    const reorderedPhotos = [photoUrl, ...existingPhotos.filter(p => p !== photoUrl)];

    // Persist to mockData.ts
    const updated = updateSpotPhotosInMockData(spotId, reorderedPhotos);

    return NextResponse.json({
      success: updated,
      message: 'Photo principale mise à jour et publiée sur le site !',
      photos: reorderedPhotos
    });
  } catch (err: any) {
    console.error('Error in set-active route:', err);
    return NextResponse.json(
      { error: err.message || 'Erreur lors de la mise à jour de la photo' },
      { status: 500 }
    );
  }
}
