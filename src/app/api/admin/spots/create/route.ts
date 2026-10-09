import { NextResponse } from 'next/server';
import { saveNewPlace } from '@/lib/spotsAdminService';
import { PlaceItem } from '@/types';

export async function POST(request: Request) {
  try {
    const { place } = await request.json();

    if (!place || !place.name) {
      return NextResponse.json(
        { error: 'Le nom du lieu est requis' },
        { status: 400 }
      );
    }

    const cleanSlug = place.slug || place.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const cleanId = place.id || cleanSlug || `lieu-${Date.now()}`;

    const newPlace: PlaceItem = {
      ...place,
      id: cleanId,
      slug: cleanSlug,
      coords: place.coords && place.coords.length === 2 ? place.coords : [14.6415, -61.0242],
      photos: place.photos && place.photos.length > 0 ? place.photos : ['/images/spots/salines.jpg'],
      rating: place.rating || 4.8,
      reviewsCount: place.reviewsCount || 1,
      tags: place.tags || ['Martinique'],
      badges: place.badges || []
    };

    const saved = saveNewPlace(newPlace);
    if (!saved) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement du nouveau lieu' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Le lieu "${newPlace.name}" a été créé avec succès !`,
      place: newPlace
    });
  } catch (err: any) {
    console.error('Error in create spot route:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
