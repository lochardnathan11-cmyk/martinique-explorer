import { createClient } from '@supabase/supabase-js';
import { PlaceItem } from '@/types';
import { INITIAL_PLACES } from '@/data/mockData';

export function getSupabaseServer() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!supabaseUrl || !supabaseKey) return null;
  return createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
    global: {
      fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' })
    }
  });
}

export const supabaseServer = getSupabaseServer();

// Convert database row to frontend PlaceItem
export function mapRowToPlace(row: any): PlaceItem {
  return {
    id: row.id,
    slug: row.slug || row.id,
    name: row.name,
    category: row.category,
    subCategory: row.sub_category || undefined,
    commune: row.commune,
    description: row.description || '',
    coords: [row.latitude, row.longitude] as [number, number],
    photos: Array.isArray(row.photos) ? row.photos : [],
    rating: Number(row.rating) || 4.8,
    reviewsCount: Number(row.reviews_count) || 0,
    featured: Boolean(row.featured),
    isHiddenGem: Boolean(row.is_hidden_gem),
    crowdLevel: row.crowd_level || 'Modérée',
    parking: row.parking || 'Facile et gratuit',
    toilets: Boolean(row.toilets),
    restaurantsNearby: Boolean(row.restaurants_nearby),
    website: row.website || undefined,
    phone: row.phone || undefined,
    address: row.address || undefined,
    schedules: row.schedules || undefined,
    priceRange: row.price_range || '€€',
    tags: Array.isArray(row.tags) ? row.tags : [],
    badges: Array.isArray(row.badges) ? row.badges : []
  };
}

// Convert frontend PlaceItem to database row
export function mapPlaceToRow(place: PlaceItem): any {
  return {
    id: place.id,
    slug: place.slug || place.id,
    name: place.name,
    category: place.category,
    sub_category: place.subCategory || null,
    commune: place.commune,
    description: place.description || '',
    latitude: place.coords[0],
    longitude: place.coords[1],
    photos: place.photos || [],
    rating: place.rating || 4.8,
    reviews_count: place.reviewsCount || 0,
    featured: place.featured || false,
    is_hidden_gem: place.isHiddenGem || false,
    crowd_level: place.crowdLevel || 'Modérée',
    parking: place.parking || 'Facile et gratuit',
    toilets: place.toilets || false,
    restaurants_nearby: place.restaurantsNearby || false,
    website: place.website || null,
    phone: place.phone || null,
    address: place.address || null,
    schedules: place.schedules || null,
    price_range: place.priceRange || '€€',
    tags: place.tags || [],
    badges: place.badges || [],
    updated_at: new Date().toISOString()
  };
}

export async function getAllPlaces(): Promise<PlaceItem[]> {
  const client = getSupabaseServer() || supabaseServer;
  if (!client) {
    return INITIAL_PLACES;
  }

  try {
    const { data, error } = await client
      .from('places')
      .select('*')
      .order('name', { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.error('Supabase query error in getAllPlaces:', error);
      return INITIAL_PLACES;
    }

    return data.map(mapRowToPlace);
  } catch (e) {
    console.error('Error fetching places from Supabase, falling back to mock:', e);
    return INITIAL_PLACES;
  }
}

export async function upsertPlaceInSupabase(place: PlaceItem) {
  const client = getSupabaseServer() || supabaseServer;
  if (!client) throw new Error('Supabase not configured');
  const row = mapPlaceToRow(place);
  const { data, error } = await client
    .from('places')
    .upsert(row, { onConflict: 'id' })
    .select();

  if (error) throw error;
  return data;
}

export async function deletePlaceFromSupabase(id: string) {
  const client = getSupabaseServer() || supabaseServer;
  if (!client) throw new Error('Supabase not configured');
  const { error } = await client
    .from('places')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}
