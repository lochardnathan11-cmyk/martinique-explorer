import { NextResponse } from 'next/server';

function parseCoordinatesFromString(str: string): [number, number] | null {
  if (!str) return null;
  const decoded = decodeURIComponent(str).trim();

  // 1. Direct decimal: "14.4325, -60.8492" or "14.4325+-60.8492"
  const direct = decoded.match(/(-?\d+\.\d+)[\s,+]+(-?\d+\.\d+)/);
  if (direct && !decoded.includes('http')) {
    const lat = parseFloat(direct[1]);
    const lng = parseFloat(direct[2]);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }

  // 2. Google Maps @lat,lng e.g. /@14.4325234,-60.8492123,17z/
  const atMatch = decoded.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }

  // 3. Query params: ?q=lat,lng or &ll=lat,lng or ?query=lat,lng
  const paramMatch = decoded.match(/[?&](?:q|ll|query|daddr|destination)=(-?\d+\.\d+)[\s,+]+(-?\d+\.\d+)/);
  if (paramMatch) {
    const lat = parseFloat(paramMatch[1]);
    const lng = parseFloat(paramMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }

  // 4. Place internal params: !3dlat!4dlng
  const placeMatch = decoded.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (placeMatch) {
    const lat = parseFloat(placeMatch[1]);
    const lng = parseFloat(placeMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }

  // 5. Degrees Minutes Seconds (DMS) format: 14°25'57.0"N 60°50'57.1"W
  const dmsMatch = decoded.match(/(\d+)°(\d+)'([\d.]+)"([NSEW])[\s,]+(\d+)°(\d+)'([\d.]+)"([NSEW])/i);
  if (dmsMatch) {
    let lat = parseInt(dmsMatch[1]) + parseInt(dmsMatch[2]) / 60 + parseFloat(dmsMatch[3]) / 3600;
    if (dmsMatch[4].toUpperCase() === 'S') lat = -lat;

    let lng = parseInt(dmsMatch[5]) + parseInt(dmsMatch[6]) / 60 + parseFloat(dmsMatch[7]) / 3600;
    if (dmsMatch[8].toUpperCase() === 'W') lng = -lng;

    return [parseFloat(lat.toFixed(6)), parseFloat(lng.toFixed(6))];
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL ou texte manquant' }, { status: 400 });
    }

    // Premier essai : extraction directe
    const directCoords = parseCoordinatesFromString(url);
    if (directCoords) {
      return NextResponse.json({ success: true, coords: directCoords, method: 'direct' });
    }

    // Deuxième essai : si c'est un lien URL, tenter de résoudre la redirection (ex: maps.app.goo.gl)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        const response = await fetch(url, {
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });

        // Vérifier l'URL finale après redirection
        const finalUrl = response.url;
        const coordsFromFinal = parseCoordinatesFromString(finalUrl);
        if (coordsFromFinal) {
          return NextResponse.json({ success: true, coords: coordsFromFinal, method: 'redirect' });
        }

        // Si toujours rien, inspecter le corps HTML (souvent présent dans <meta property="og:image" content="...center=lat%2Clng...">)
        const html = await response.text();
        const coordsFromHtml = parseCoordinatesFromString(html);
        if (coordsFromHtml) {
          return NextResponse.json({ success: true, coords: coordsFromHtml, method: 'html' });
        }
      } catch (fetchErr) {
        console.warn('Could not resolve shortened URL:', fetchErr);
      }
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Impossible d\'extraire les coordonnées GPS. Veuillez vérifier le lien ou saisir la latitude et la longitude.' 
    }, { status: 422 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
