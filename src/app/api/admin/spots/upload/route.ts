import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabaseServer } from '@/lib/placesSupabaseService';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const spotId = formData.get('spotId') as string | null;
    const spotName = formData.get('spotName') as string | null;

    if (!file) {
      return NextResponse.json({ error: 'Fichier image manquant' }, { status: 400 });
    }

    // Determine extension
    const originalName = file.name || 'photo.jpg';
    const ext = path.extname(originalName).toLowerCase() || '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp', '.avif'].includes(ext) ? ext : '.jpg';

    const timestamp = Date.now();
    const rawPrefix = (spotName || spotId || 'lieu')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9_-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 30);
    const prefix = rawPrefix || 'spot';
    const filename = `spot-${prefix}-${timestamp}${safeExt}`;

    let publicUrl = '';

    // 1. Tenter l'upload Supabase Storage si un bucket "spots" ou "places" existe
    if (supabaseServer) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const { data: uploadData, error: uploadError } = await supabaseServer.storage
          .from('spots')
          .upload(filename, buffer, {
            contentType: file.type || 'image/jpeg',
            upsert: true
          });

        if (!uploadError && uploadData) {
          const { data: publicData } = supabaseServer.storage.from('spots').getPublicUrl(filename);
          if (publicData?.publicUrl) {
            publicUrl = publicData.publicUrl;
          }
        }
      } catch (storageErr) {
        // Fallback local
      }
    }

    // 2. Sauvegarde sur disque local public/images/spots pour que l'image soit servie immédiatement
    const spotsDir = path.join(process.cwd(), 'public', 'images', 'spots');
    if (!fs.existsSync(spotsDir)) {
      fs.mkdirSync(spotsDir, { recursive: true });
    }
    const targetFilePath = path.join(spotsDir, filename);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(targetFilePath, buffer);

    if (!publicUrl) {
      publicUrl = `/images/spots/${filename}`;
    }

    return NextResponse.json({
      success: true,
      message: 'Photo téléversée avec succès !',
      photoUrl: publicUrl,
      filename
    });
  } catch (err: any) {
    console.error('Error in spots upload route:', err);
    return NextResponse.json({ error: err.message || 'Erreur lors du téléversement' }, { status: 500 });
  }
}
