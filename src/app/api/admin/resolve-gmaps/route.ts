import { NextResponse } from 'next/server';

const MARTINIQUE_COMMUNES = [
  "L'Ajoupa-Bouillon", "Les Anses-d'Arlet", "Basse-Pointe", "Bellefontaine",
  "Le Carbet", "Case-Pilote", "Le Diamant", "Ducos", "Fonds-Saint-Denis",
  "Fort-de-France", "Le François", "Grand'Rivière", "Gros-Morne",
  "Le Lamentin", "Le Lorrain", "Macouba", "Marigot", "Le Marin",
  "Le Morne-Rouge", "Le Morne-Vert", "Le Prêcheur", "Rivière-Pilote",
  "Rivière-Salée", "Le Robert", "Sainte-Anne", "Sainte-Luce",
  "Sainte-Marie", "Saint-Esprit", "Saint-Joseph", "Saint-Pierre",
  "Schœlcher", "La Trinité", "Les Trois-Îlets", "Le Vauclin"
];

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

function extractNameFromGoogleUrl(url: string, htmlContent?: string): string | null {
  // Essai 1: depuis l'URL /maps/place/Nom+Du+Lieu/
  const placeMatch = url.match(/\/maps\/place\/([^/@?]+)/);
  if (placeMatch && placeMatch[1]) {
    const clean = decodeURIComponent(placeMatch[1])
      .replace(/\+/g, ' ')
      .replace(/[0-9]{5}\s+Martinique.*/i, '')
      .trim();
    if (clean && clean.length > 2) return clean;
  }

  // Essai 2: depuis le titre HTML
  if (htmlContent) {
    const ogTitle = htmlContent.match(/<meta property="og:title" content="([^"]+)"/i);
    if (ogTitle && ogTitle[1] && !ogTitle[1].includes('Google Maps')) {
      return ogTitle[1].trim();
    }

    const titleTag = htmlContent.match(/<title>([^<]+)<\/title>/i);
    if (titleTag && titleTag[1]) {
      const clean = titleTag[1].replace(/\s*-\s*Google Maps/i, '').trim();
      if (clean && clean.length > 2) return clean;
    }
  }

  return null;
}

function detectCommune(text: string): string | null {
  if (!text) return null;
  const lower = text.toLowerCase();
  for (const c of MARTINIQUE_COMMUNES) {
    const cLower = c.toLowerCase().replace(/^(le|la|les|l')\s*/, '');
    if (lower.includes(c.toLowerCase()) || lower.includes(cLower)) {
      return c;
    }
  }
  return null;
}

function detectCategory(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('plage') || lower.includes('anse') || lower.includes('baie') || lower.includes('îlet') || lower.includes('ilet')) {
    return 'beach';
  }
  if (lower.includes('hotel') || lower.includes('hôtel') || lower.includes('résidence') || lower.includes('lodge') || lower.includes('villa') || lower.includes('domaine')) {
    return 'accommodation';
  }
  if (lower.includes('restaurant') || lower.includes('bistrot') || lower.includes('bar') || lower.includes('snack') || lower.includes('café') || lower.includes('table')) {
    return 'restaurant';
  }
  if (lower.includes('point de vue') || lower.includes('belvédère') || lower.includes('morne') || lower.includes('panorama') || lower.includes('rocher')) {
    return 'viewpoint';
  }
  if (lower.includes('randonnée') || lower.includes('cascade') || lower.includes('sentier') || lower.includes('kayak') || lower.includes('plongée') || lower.includes('musée') || lower.includes('habitation') || lower.includes('distillerie')) {
    return 'activity';
  }
  return 'beach'; // défaut
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL ou texte manquant' }, { status: 400 });
    }

    let finalUrl = url.trim();
    let htmlBody = '';

    // Si c'est une URL web, résoudre la redirection (ex: maps.app.goo.gl)
    if (finalUrl.startsWith('http://') || finalUrl.startsWith('https://')) {
      try {
        const response = await fetch(finalUrl, {
          redirect: 'follow',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        finalUrl = response.url || finalUrl;
        htmlBody = await response.text();
      } catch (fetchErr) {
        console.warn('Could not follow redirect:', fetchErr);
      }
    }

    // 1. Extraire les coordonnées GPS
    const coords = parseCoordinatesFromString(finalUrl) || parseCoordinatesFromString(htmlBody) || parseCoordinatesFromString(url);

    // 2. Extraire le nom du lieu
    const rawName = extractNameFromGoogleUrl(finalUrl, htmlBody) || extractNameFromGoogleUrl(url);
    const cleanName = rawName ? rawName.replace(/,\s*Martinique.*/i, '').trim() : '';

    // 3. Détecter la commune
    const fullTextSearch = `${cleanName} ${finalUrl} ${htmlBody.slice(0, 3000)}`;
    const detectedCommune = detectCommune(fullTextSearch);

    // Si le nom se termine par la commune ou la Martinique, nettoyer
    let refinedName = cleanName;
    if (detectedCommune) {
      refinedName = refinedName.replace(new RegExp(`,\\s*${detectedCommune}.*`, 'i'), '').trim();
    }
    refinedName = refinedName.replace(/,\s*Martinique.*/i, '').trim();

    // 4. Détecter la catégorie
    const detectedCat = refinedName ? detectCategory(refinedName) : 'beach';

    return NextResponse.json({
      success: true,
      coords: coords || null,
      name: refinedName || '',
      commune: detectedCommune || '',
      category: detectedCat,
      data: {
        coords: coords || null,
        name: refinedName || '',
        commune: detectedCommune || '',
        category: detectedCat,
        originalUrl: url
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
