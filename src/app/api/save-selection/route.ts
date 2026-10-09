import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { selections } = body; // e.g. { 'montagne-pelee': '13-A', ... }

    if (!selections || typeof selections !== 'object') {
      return NextResponse.json({ error: 'Invalid selections' }, { status: 400 });
    }

    const spotsDir = path.join(process.cwd(), 'public', 'images', 'spots');
    if (!fs.existsSync(spotsDir)) {
      fs.mkdirSync(spotsDir, { recursive: true });
    }

    // Mapping of candidate IDs to file names
    const optionToFileMap: Record<string, string> = {
      '1-A': 'salines-a.jpg',
      '1-B': 'salines-b.jpg',
      '2-C': 'dufour-c.jpg',
      '3-C': 'noire-c.jpg',
      '4-A': 'diamant-a.jpg',
      '4-B': 'diamant-b.jpg',
      '5-A': 'couleuvre-a.jpg',
      '6-A': 'ponton-arlet-a.jpg',
      '7-A': 'cap110-a.jpg',
      '8-A': 'grande-anse-a.jpg',
      '8-B': 'grande-anse-b.jpg',
      '9-A': 'pointe-marin-a.jpg',
      '10-A': 'anse-figuier-a.jpg',
      '11-A': 'pointe-faula-a.jpg',
      '12-A': 'tartane-a.jpg',
      '13-A': 'pelee-a.jpg',
      '13-B': 'pelee-b.jpg',
      '13-C': 'pelee-c.jpg',
      '14-A': 'josephine-a.jpg',
      '14-B': 'josephine-b.jpg',
      '15-A': 'caravelle-a.jpg',
      '15-B': 'caravelle-b.jpg',
      '16-A': 'dauphins-a.jpg',
      '16-B': 'dauphins-b.jpg',
      '17-A': 'bakoua-a.jpg',
      '17-B': 'bakoua-b.jpg',
      '18-A': 'ti-sable-a.jpg',
      '19-A': 'gommier-a.jpg',
      '19-B': 'gommier-b.jpg',
      '20-A': 'trabaud-a.jpg',
      '20-B': 'trabaud-b.jpg',
      '21-A': 'ceron-a.jpg',
      '21-B': 'ceron-b.jpg'
    };

    const spotToFileTarget: Record<string, string> = {
      'montagne-pelee': 'montagne-pelee.jpg',
      'baignoire-josephine': 'baignoire-josephine.jpg',
      'randonnee-caravelle': 'sentier-caravelle.jpg',
      'excursion-dauphins': 'excursion-dauphins.jpg',
      'hotel-bakoua': 'hotel-bakoua.jpg',
      'ti-sable': 'ti-sable.jpg',
      'belvedere-morne-gommier': 'morne-gommier.jpg',
      'secret-anse-trabaud': 'anse-trabaud.jpg',
      'anse-ceron': 'anse-ceron.jpg'
    };

    for (const [spotId, optionId] of Object.entries(selections)) {
      const srcFile = optionToFileMap[optionId as string];
      const targetName = spotToFileTarget[spotId] || `${spotId}.jpg`;
      if (srcFile) {
        const srcPath = path.join(process.cwd(), 'public', 'images', 'candidates', srcFile);
        const targetPath = path.join(spotsDir, targetName);
        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, targetPath);
        }
      }
    }

    return NextResponse.json({ success: true, saved: selections });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
