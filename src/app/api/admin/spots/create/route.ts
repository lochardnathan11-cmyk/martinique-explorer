import { NextResponse } from 'next/server';
import { saveNewPlace } from '@/lib/spotsAdminService';
import { upsertPlaceInSupabase } from '@/lib/placesSupabaseService';
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

    // 1. Sauvegarder dans le fichier mock pour synchro locale
    saveNewPlace(newPlace);

    // 2. Sauvegarder dans Supabase si disponible
    try {
      await upsertPlaceInSupabase(newPlace);
    } catch (dbErr) {
      console.warn('Note: Could not save to Supabase yet (table might be absent):', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: `Le lieu "${newPlace.name}" a été créé avec succès !`,
      place: newPlace
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Erreur serveur lors de la création' },
      { status: 500 }
    );
  }
}
