import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { INITIAL_PLACES } from '@/data/mockData';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseServiceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json({ error: 'Supabase credentials missing in env' }, { status: 500 });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false }
    });

    // Format the data to match the SQL table schema exactly
    const formattedPlaces = INITIAL_PLACES.map(p => ({
      id: p.id,
      slug: p.slug || p.id,
      name: p.name,
      category: p.category,
      sub_category: p.subCategory || null,
      commune: p.commune,
      description: p.description || '',
      latitude: p.coords[0],
      longitude: p.coords[1],
      photos: p.photos || [],
      rating: p.rating || 4.8,
      reviews_count: p.reviewsCount || 0,
      featured: p.featured || false,
      is_hidden_gem: p.isHiddenGem || false,
      crowd_level: p.crowdLevel || 'Modérée',
      parking: p.parking || 'Facile et gratuit',
      toilets: p.toilets || false,
      restaurants_nearby: p.restaurantsNearby || false,
      website: p.website || null,
      phone: p.phone || null,
      address: p.address || null,
      schedules: p.schedules || null,
      price_range: p.priceRange || '€€',
      tags: p.tags || [],
      badges: p.badges || []
    }));

    const { data, error } = await supabaseAdmin
      .from('places')
      .upsert(formattedPlaces, { onConflict: 'id' });

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: `✅ ${formattedPlaces.length} lieux ont été importés avec succès dans Supabase !`,
      data
    });
  } catch (err: any) {
    console.error('Seed error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
