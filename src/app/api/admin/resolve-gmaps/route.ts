import { NextResponse } from 'next/server';

const MARTINIQUE_COMMUNES_CENTROIDS = [
  { name: "L'Ajoupa-Bouillon", coords: [14.8250, -61.1167] },
  { name: "Les Anses-d'Arlet", coords: [14.4917, -61.0806] },
  { name: "Basse-Pointe", coords: [14.8694, -61.1222] },
  { name: "Bellefontaine", coords: [14.6739, -61.1644] },
  { name: "Le Carbet", coords: [14.7111, -61.1819] },
  { name: "Case-Pilote", coords: [14.6444, -61.1389] },
  { name: "Le Diamant", coords: [14.4789, -61.0261] },
  { name: "Ducos", coords: [14.5750, -60.9750] },
  { name: "Fonds-Saint-Denis", coords: [14.7389, -61.1139] },
  { name: "Fort-de-France", coords: [14.6089, -61.0733] },
  { name: "Le François", coords: [14.6153, -60.9028] },
  { name: "Grand'Rivière", coords: [14.8736, -61.1806] },
  { name: "Gros-Morne", coords: [14.7083, -61.0056] },
  { name: "Le Lamentin", coords: [14.6167, -61.0000] },
  { name: "Le Lorrain", coords: [14.8333, -61.0667] },
  { name: "Macouba", coords: [14.8750, -61.1444] },
  { name: "Marigot", coords: [14.8194, -61.0278] },
  { name: "Le Marin", coords: [14.4719, -60.8708] },
  { name: "Le Morne-Rouge", coords: [14.7736, -61.1361] },
  { name: "Le Morne-Vert", coords: [14.7083, -61.1444] },
  { name: "Le Prêcheur", coords: [14.8014, -61.2250] },
  { name: "Rivière-Pilote", coords: [14.4867, -60.9036] },
  { name: "Rivière-Salée", coords: [14.5292, -60.9806] },
  { name: "Le Robert", coords: [14.6778, -60.9417] },
  { name: "Sainte-Anne", coords: [14.4353, -60.8814] },
  { name: "Sainte-Luce", coords: [14.4694, -60.9222] },
  { name: "Sainte-Marie", coords: [14.7833, -60.9944] },
  { name: "Saint-Esprit", coords: [14.5611, -60.9361] },
  { name: "Saint-Joseph", coords: [14.6706, -61.0375] },
  { name: "Saint-Pierre", coords: [14.7431, -61.1758] },
  { name: "Schœlcher", coords: [14.6167, -61.1000] },
  { name: "La Trinité", coords: [14.7375, -60.9639] },
  { name: "Les Trois-Îlets", coords: [14.5392, -61.0353] },
  { name: "Le Vauclin", coords: [14.5458, -60.8385] }
];

const POSTAL_CODE_TO_COMMUNE: Record<string, string> = {
  '97200': 'Fort-de-France',
  '97210': 'Le Carbet',
  '97211': 'Rivière-Pilote',
  '97212': 'Saint-Joseph',
  '97213': 'Gros-Morne',
  '97214': 'La Trinité',
  '97215': 'Rivière-Salée',
  '97216': "L'Ajoupa-Bouillon",
  '97217': "Les Anses-d'Arlet",
  '97218': 'Basse-Pointe',
  '97220': 'La Trinité',
  '97221': 'Le Carbet',
  '97222': 'Bellefontaine',
  '97223': 'Le Diamant',
  '97224': 'Ducos',
  '97225': 'Marigot',
  '97226': 'Le Morne-Vert',
  '97227': 'Sainte-Anne',
  '97228': 'Sainte-Luce',
  '97229': 'Les Trois-Îlets',
  '97230': 'Sainte-Marie',
  '97231': 'Le Robert',
  '97232': 'Le Lamentin',
  '97233': 'Schœlcher',
  '97234': 'Fort-de-France',
  '97240': 'Le François',
  '97250': 'Saint-Pierre',
  '97260': 'Le Morne-Rouge',
  '97270': 'Saint-Esprit',
  '97280': 'Le Vauclin',
  '97290': 'Le Marin'
};

const LOCALITY_TO_COMMUNE: Record<string, string> = {
  'tartane': 'La Trinité',
  'pointe du bout': 'Les Trois-Îlets',
  'anse mitan': 'Les Trois-Îlets',
  'anse a l\'ane': 'Les Trois-Îlets',
  'anse a lane': 'Les Trois-Îlets',
  'village de la poterie': 'Les Trois-Îlets',
  'anse dufour': "Les Anses-d'Arlet",
  'anse noire': "Les Anses-d'Arlet",
  'grande anse d\'arlet': "Les Anses-d'Arlet",
  'salines': 'Sainte-Anne',
  'cap chevalier': 'Sainte-Anne',
  'anse michel': 'Sainte-Anne',
  'anse caritan': 'Sainte-Anne',
  'anse figuier': 'Rivière-Pilote',
  'corps de garde': 'Sainte-Luce',
  'gros raisins': 'Sainte-Luce',
  'balata': 'Fort-de-France',
  'didier': 'Fort-de-France',
  'clairiere': 'Fort-de-France',
  'bellemene': 'Le Lamentin',
  'acajou': 'Le Lamentin',
  'presqu\'ile de la caravelle': 'La Trinité',
  'presqu ile de la caravelle': 'La Trinité',
  'rocher du diamant': 'Le Diamant',
  'chery': 'Le Diamant',
  'fond fleuri': 'Le Carbet'
};

function normalizeText(str: string): string {
  return (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
}

function matchCommune(text: string | null | undefined): string | null {
  if (!text) return null;
  const lower = normalizeText(text);

  // 1. Détection directe du nom complet de commune (tri par longueur décroissante)
  const sortedCommunes = [...MARTINIQUE_COMMUNES_CENTROIDS].sort((a, b) => b.name.length - a.name.length);
  for (const c of sortedCommunes) {
    const cNorm = normalizeText(c.name);
    const lowerClean = lower.replace(/-/g, ' ');
    if (lowerClean.includes(cNorm.replace(/-/g, ' '))) {
      return c.name;
    }
  }

  // 2. Détection par code postal (972xx)
  const zipMatch = text.match(/\b(972\d{2})\b/);
  if (zipMatch) {
    const zip = zipMatch[1];
    const communeFromZip = POSTAL_CODE_TO_COMMUNE[zip];
    if (communeFromZip) {
      if (zip === '97250') {
        if (lower.includes('fonds saint denis') || lower.includes('fonds-saint-denis')) return 'Fonds-Saint-Denis';
        if (lower.includes('precheur')) return 'Le Prêcheur';
        return 'Saint-Pierre';
      }
      if (zip === '97218') {
        if (lower.includes('grand riviere') || lower.includes('grand\'riviere')) return "Grand'Rivière";
        if (lower.includes('macouba')) return 'Macouba';
        return 'Basse-Pointe';
      }
      if (zip === '97233') {
        if (lower.includes('case pilote') || lower.includes('case-pilote')) return 'Case-Pilote';
        return 'Schœlcher';
      }
      return communeFromZip;
    }
  }

  // 3. Détection par localité / quartier / plage renommée
  for (const [locality, commune] of Object.entries(LOCALITY_TO_COMMUNE)) {
    if (lower.includes(locality)) {
      return commune;
    }
  }

  // 4. Détection sans article (ex: "Trois-Îlets", "Marin") avec délimiteur de mot
  for (const c of sortedCommunes) {
    const cNorm = normalizeText(c.name);
    const cClean = cNorm.replace(/^(le|la|les|l')\s*/, '').replace(/-/g, ' ');
    const lowerClean = lower.replace(/-/g, ' ');
    if (cClean.length >= 4) {
      const regex = new RegExp(`\\b${cClean}\\b`, 'i');
      if (regex.test(lowerClean)) {
        return c.name;
      }
    }
  }

  return null;
}

function getClosestCommune(lat: number, lng: number): string | null {
  // If coordinates are in Martinique bounding box roughly [14.3, 15.0], [-61.3, -60.7]
  if (lat < 14.2 || lat > 15.1 || lng < -61.4 || lng > -60.6) {
    return null;
  }

  let closest: string | null = null;
  let minDist = Infinity;
  for (const c of MARTINIQUE_COMMUNES_CENTROIDS) {
    const dLat = (c.coords[0] - lat) * 111.0;
    const dLng = (c.coords[1] - lng) * 111.0 * Math.cos((lat * Math.PI) / 180);
    const dist = Math.sqrt(dLat * dLat + dLng * dLng);
    if (dist < minDist) {
      minDist = dist;
      closest = c.name;
    }
  }
  return closest;
}

function parseCoordinatesFromString(str: string): [number, number] | null {
  if (!str) return null;
  const decoded = decodeURIComponent(str).trim();

  // 1. Place internal params in Google Maps URL: !3dlat!4dlng (EXACT place position)
  const placeMatch = decoded.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (placeMatch) {
    const lat = parseFloat(placeMatch[1]);
    const lng = parseFloat(placeMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }

  // 2. Direct decimal: "14.4325, -60.8492" or "14.4325+-60.8492"
  const direct = decoded.match(/(-?\d+\.\d+)[\s,+]+(-?\d+\.\d+)/);
  if (direct && !decoded.includes('http')) {
    const lat = parseFloat(direct[1]);
    const lng = parseFloat(direct[2]);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }

  // 3. Query params: ?q=lat,lng or &ll=lat,lng or ?query=lat,lng
  const paramMatch = decoded.match(/[?&](?:q|ll|query|daddr|destination)=(-?\d+\.\d+)[\s,+]+(-?\d+\.\d+)/);
  if (paramMatch) {
    const lat = parseFloat(paramMatch[1]);
    const lng = parseFloat(paramMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) return [lat, lng];
  }

  // 4. Google Maps viewport @lat,lng e.g. /@14.4325234,-60.8492123,17z/
  const atMatch = decoded.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
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

function detectCategory(name = '', categoryRaw = '', address = ''): string {
  const norm = (s: string) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const catRaw = norm(categoryRaw);
  const n = norm(name);
  const addr = norm(address);

  // 1. Hébergement & Hôtel (Prioritaire pour résidences, hôtels, gîtes, lodges, etc.)
  if (
    catRaw.includes('hotel') ||
    catRaw.includes('residence') ||
    catRaw.includes('hebergement') ||
    catRaw.includes('lodging') ||
    catRaw.includes('chambre d\'hote') ||
    catRaw.includes('gite') ||
    catRaw.includes('resort') ||
    catRaw.includes('bungalow') ||
    catRaw.includes('villa') ||
    catRaw.includes('auberge') ||
    catRaw.includes('camping') ||
    catRaw.includes('complexe hotelier') ||
    catRaw.includes('location de vacances') ||
    catRaw.includes('village de vacances') ||
    catRaw.includes('meuble de tourisme') ||
    catRaw.includes('bed & breakfast') ||
    catRaw.includes('motel')
  ) {
    return 'accommodation';
  }

  if (
    /\b(hotel|residence|resort|lodge|ecolodge|bungalow|bungalows|gite|gites|villa|villas|auberge|domaine hotelier|chambres? d'hotes?)\b/i.test(name) ||
    n.startsWith('hotel ') ||
    n.startsWith('residence ') ||
    n.startsWith('villa ') ||
    n.startsWith('gite ') ||
    n.includes('residence hoteliere') ||
    n.includes('chambre d\'hote')
  ) {
    return 'accommodation';
  }

  // 2. Point de vue & Panorama (Prioritaire sur randonnée car souvent situé sur un morne)
  if (
    catRaw.includes('point de vue') ||
    catRaw.includes('belvedere') ||
    catRaw.includes('panorama') ||
    catRaw.includes('table d\'orientation') ||
    catRaw.includes('observation')
  ) {
    return 'viewpoint';
  }
  if (
    n.includes('point de vue') ||
    n.includes('belvedere') ||
    n.includes('panorama') ||
    n.includes('table d\'orientation')
  ) {
    return 'viewpoint';
  }

  // 3. Randonnées & Sentiers & Volcans
  if (
    catRaw.includes('sentier') ||
    catRaw.includes('randonnee') ||
    catRaw.includes('hiking') ||
    catRaw.includes('trail') ||
    catRaw.includes('point de depart de sentier') ||
    catRaw.includes('volcan') ||
    catRaw.includes('parc national') ||
    catRaw.includes('reserve naturelle')
  ) {
    return 'hiking';
  }
  if (
    /\b(sentier|randonnee|trace|piton|montagne pelee|gorges de la falaise|volcan)\b/i.test(name) ||
    n.startsWith('trace ') ||
    n.startsWith('sentier ') ||
    n.includes('sentier de') ||
    n.includes('ascension')
  ) {
    return 'hiking';
  }

  // 4. Excursions & Sorties en Mer
  if (
    catRaw.includes('excursion') ||
    catRaw.includes('croisiere') ||
    catRaw.includes('bateau') ||
    catRaw.includes('catamaran') ||
    catRaw.includes('plongee') ||
    catRaw.includes('scuba') ||
    catRaw.includes('tour operateur') ||
    catRaw.includes('agence de voyage') ||
    catRaw.includes('location de bateau') ||
    catRaw.includes('nautique')
  ) {
    return 'excursion';
  }
  if (
    n.includes('excursion') ||
    n.includes('croisiere') ||
    n.includes('catamaran') ||
    n.includes('plongee') ||
    n.includes('dauphins') ||
    n.includes('baignoire de josephine') ||
    n.includes('fonds blancs') ||
    n.includes('sortie en mer')
  ) {
    return 'excursion';
  }

  // 5. Restaurants & Bars
  if (
    catRaw.includes('restaurant') ||
    catRaw.includes('bistrot') ||
    catRaw.includes('brasserie') ||
    catRaw.includes('snack') ||
    catRaw.includes('bar') ||
    catRaw.includes('glacier') ||
    catRaw.includes('creperie') ||
    catRaw.includes('pizzeria') ||
    catRaw.includes('cafe') ||
    catRaw.includes('food') ||
    catRaw.includes('traiteur')
  ) {
    return 'restaurant';
  }
  if (
    /\b(restaurant|resto|bistrot|brasserie|snack|lolo|creperie|pizzeria|glacier|bar lounge|beach bar)\b/i.test(name) ||
    n.startsWith('restaurant ') ||
    n.startsWith('snack ') ||
    n.startsWith('le bar ') ||
    n.startsWith('chez ')
  ) {
    return 'restaurant';
  }

  // 6. Plages & Baies
  if (
    catRaw.includes('plage') ||
    catRaw.includes('beach') ||
    catRaw.includes('anse') ||
    catRaw.includes('baie') ||
    catRaw.includes('crique')
  ) {
    return 'beach';
  }
  if (
    /\b(plage|anse|baie|crique|cap macre|cap chevalier)\b/i.test(name) ||
    n.startsWith('plage ') ||
    n.startsWith('anse ') ||
    n.startsWith('grande anse') ||
    n.startsWith('petite anse')
  ) {
    return 'beach';
  }

  // 7. Activités culturelles, visites, musées
  if (
    catRaw.includes('musee') ||
    catRaw.includes('museum') ||
    catRaw.includes('distillerie') ||
    catRaw.includes('jardin') ||
    catRaw.includes('zoo') ||
    catRaw.includes('attraction') ||
    catRaw.includes('parc') ||
    catRaw.includes('monument') ||
    catRaw.includes('culture') ||
    catRaw.includes('galerie')
  ) {
    return 'activity';
  }
  if (
    /\b(habitation|distillerie|musee|jardin botanique|zoo|savane des esclaves)\b/i.test(name) ||
    n.startsWith('habitation ') ||
    n.startsWith('distillerie ') ||
    n.startsWith('jardin de balata')
  ) {
    return 'activity';
  }

  return 'beach'; // fallback
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
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7'
          }
        });
        finalUrl = response.url || finalUrl;
        htmlBody = await response.text();
      } catch (fetchErr) {
        console.warn('Could not follow redirect:', fetchErr);
      }
    }

    let name: string | null = null;
    let categoryRaw: string | null = null;
    let commune: string | null = null;
    let coords: [number, number] | null = null;
    let phone: string | null = null;
    let website: string | null = null;
    let address: string | null = null;
    let rating: number | null = null;
    let reviewsCount: number | null = null;

    // 1. Tenter d'interroger le point de prévisualisation Google Maps (protobuf JSON)
    const previewMatch = htmlBody.match(/\/maps\/preview\/place\?[^"'\s<>]+/);
    if (previewMatch) {
      const previewUrl = 'https://www.google.com' + previewMatch[0].replace(/&amp;/g, '&');
      try {
        const prevRes = await fetch(previewUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Language': 'fr-FR,fr;q=0.9'
          }
        });
        const prevText = await prevRes.text();
        const cleanJson = prevText.replace(/^\)\]\}'\s*/, '');
        const data = JSON.parse(cleanJson);
        const placeData = data[6];

        if (placeData) {
          name = placeData[11] || placeData[2]?.[0];
          categoryRaw = placeData[13]?.[0] || placeData[64]?.[3] || placeData[96]?.[10]?.[1]?.[0]?.[1]?.[2]?.[1];
          address = placeData[18] || placeData[39];

          // Coordonnées exactes du lieu
          if (placeData[9]?.[2] && placeData[9]?.[3]) {
            coords = [placeData[9][2], placeData[9][3]];
          }

          // Extraction de la commune depuis les données structurées Google
          commune = matchCommune(placeData[82]?.[3]) ||
                    matchCommune(placeData[183]?.[1]?.[3]) ||
                    matchCommune(address) ||
                    matchCommune(placeData[166]) ||
                    matchCommune(placeData[2]?.[2]);

          phone = placeData[178]?.[0]?.[0] || null;
          website = placeData[7]?.[0] || null;
          rating = placeData[4]?.[7] ? parseFloat(placeData[4][7]) : null;
          reviewsCount = placeData[4]?.[8] ? parseInt(placeData[4][8]) : null;
        }
      } catch (e: any) {
        console.warn('Google preview parse error:', e.message);
      }
    }

    // 2. Coordonnées de secours depuis l'URL ou le HTML
    if (!coords) {
      coords = parseCoordinatesFromString(finalUrl) || parseCoordinatesFromString(htmlBody) || parseCoordinatesFromString(url);
    }

    // 3. Nom de secours depuis l'URL ou les balises meta
    if (!name) {
      const placeMatch = finalUrl.match(/\/maps\/place\/([^/@?]+)/);
      if (placeMatch && placeMatch[1]) {
        name = decodeURIComponent(placeMatch[1])
          .replace(/\+/g, ' ')
          .replace(/[0-9]{5}\s+Martinique.*/i, '')
          .trim();
      }

      if (!name && htmlBody) {
        const ogTitle = htmlBody.match(/<meta property="og:title" content="([^"]+)"/i);
        if (ogTitle && ogTitle[1] && !ogTitle[1].includes('Google Maps')) {
          name = ogTitle[1].trim();
        } else {
          const titleTag = htmlBody.match(/<title>([^<]+)<\/title>/i);
          if (titleTag && titleTag[1]) {
            const clean = titleTag[1].replace(/\s*-\s*Google Maps/i, '').trim();
            if (clean && clean.length > 2) name = clean;
          }
        }
      }
    }

    // 4. Nettoyage du nom
    let refinedName = name ? name.replace(/,\s*Martinique.*/i, '').trim() : '';

    // 5. Détection de la Commune si pas encore trouvée
    if (!commune && address) {
      commune = matchCommune(address);
    }
    if (!commune && refinedName) {
      commune = matchCommune(refinedName);
    }
    if (!commune && finalUrl) {
      commune = matchCommune(finalUrl);
    }
    if (!commune && htmlBody) {
      const ogDesc = htmlBody.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
      if (ogDesc && ogDesc[1]) {
        commune = matchCommune(ogDesc[1]);
      }
    }

    // Si toujours pas trouvée mais on a les coordonnées GPS : Reverse Geocoding
    if (!commune && coords && coords[0] && coords[1]) {
      try {
        const geoRes = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords[0]}&longitude=${coords[1]}&localityLanguage=fr`,
          { headers: { 'User-Agent': 'MartiniqueExplorer/1.0' } }
        );
        const geoData = await geoRes.json();
        commune = matchCommune(geoData.locality) || matchCommune(geoData.city);
      } catch (geoErr) {
        // Ignorer
      }

      if (!commune) {
        try {
          const osmRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords[0]}&lon=${coords[1]}&zoom=14&addressdetails=1`,
            { headers: { 'User-Agent': 'MartiniqueExplorer/1.0' } }
          );
          const osmData = await osmRes.json();
          const addr = osmData.address || {};
          commune = matchCommune(addr.village) || matchCommune(addr.town) || matchCommune(addr.city) || matchCommune(addr.municipality);
        } catch (osmErr) {
          // Ignorer
        }
      }

      // Dernier recours 100% infaillible en Martinique : calcul du centroïde le plus proche
      if (!commune) {
        commune = getClosestCommune(coords[0], coords[1]);
      }
    }

    // Nettoyer le nom si la commune y est concaténée
    if (commune && refinedName) {
      refinedName = refinedName.replace(new RegExp(`,\\s*${commune}.*`, 'i'), '').trim();
    }

    // 6. Détection de la catégorie
    const detectedCat = detectCategory(refinedName, categoryRaw || '', address || '');

    const placeMapsUrl = (finalUrl && finalUrl.startsWith('http') && (finalUrl.includes('google.com/maps') || finalUrl.includes('maps.app.goo.gl')))
      ? finalUrl
      : (url && url.startsWith('http') ? url : null);

    return NextResponse.json({
      success: true,
      coords: coords || null,
      name: refinedName || '',
      commune: commune || '',
      category: detectedCat,
      categoryRaw: categoryRaw || null,
      address: address || null,
      phone: phone || null,
      website: website || null,
      rating: rating || null,
      reviewsCount: reviewsCount || null,
      mapsUrl: placeMapsUrl,
      data: {
        coords: coords || null,
        name: refinedName || '',
        commune: commune || '',
        category: detectedCat,
        categoryRaw: categoryRaw || null,
        address: address || null,
        phone: phone || null,
        website: website || null,
        rating: rating || null,
        reviewsCount: reviewsCount || null,
        originalUrl: url,
        mapsUrl: placeMapsUrl
      }
    });
  } catch (err: any) {
    console.error('Resolve Google Maps error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
