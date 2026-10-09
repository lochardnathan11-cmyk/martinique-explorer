import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { INITIAL_PLACES } from '@/data/mockData';
import { updateSpotPhotosInMockData } from '@/lib/photoUploadService';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const spotId = formData.get('spotId') as string | null;

    if (!file || !spotId) {
      return NextResponse.json(
        { error: 'Le fichier et l\'identifiant du lieu (spotId) sont requis' },
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

    const spotsDir = path.join(process.cwd(), 'public', 'images', 'spots');
    if (!fs.existsSync(spotsDir)) {
      fs.mkdirSync(spotsDir, { recursive: true });
    }

    // Determine clean file extension
    const originalName = file.name || 'photo.jpg';
    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext) ? ext : '.jpg';
    
    // Generate clean unique filename
    const timestamp = Date.now();
    const cleanSpotId = spotId.replace(/[^a-z0-9_-]/gi, '-');
    const filename = `spot-${cleanSpotId}-${timestamp}${safeExt}`;
    const targetFilePath = path.join(spotsDir, filename);

    // Write file to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(targetFilePath, buffer);

    const publicUrl = `/images/spots/${filename}`;

    // Update spot photos list: put new uploaded photo at index 0 (published)
    const existingPhotos = Array.isArray(currentSpot.photos) ? currentSpot.photos : [];
    const updatedPhotos = [publicUrl, ...existingPhotos.filter(p => p !== publicUrl)];

    // Persist to mockData.ts
    updateSpotPhotosInMockData(spotId, updatedPhotos);

    return NextResponse.json({
      success: true,
      message: 'Photo déposée et publiée avec succès !',
      photoUrl: publicUrl,
      photos: updatedPhotos
    });
  } catch (err: any) {
    console.error('Error in upload route:', err);
    return NextResponse.json(
      { error: err.message || 'Erreur lors de l\'enregistrement de la photo' },
      { status: 500 }
    );
  }
}
