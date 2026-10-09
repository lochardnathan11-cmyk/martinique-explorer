import fs from 'fs';
import path from 'path';
import { PlaceItem } from '@/types';
import { INITIAL_PLACES } from '@/data/mockData';

export function getMockDataPlaces(): PlaceItem[] {
  return INITIAL_PLACES;
}

export function saveUpdatedPlace(updatedPlace: PlaceItem): boolean {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'mockData.ts');
    if (!fs.existsSync(filePath)) return false;

    let content = fs.readFileSync(filePath, 'utf8');

    // Find spot by id
    const idNeedle = `id: '${updatedPlace.id}'`;
    const idIndex = content.indexOf(idNeedle);
    if (idIndex === -1) {
      console.warn(`Place ${updatedPlace.id} not found in mockData.ts`);
      return false;
    }

    // Find the enclosing object: from "{" right before idIndex to the matching "}"
    const objStartIndex = content.lastIndexOf('{', idIndex);
    if (objStartIndex === -1) return false;

    // Find closing brace of this place object by counting braces
    let depth = 0;
    let objEndIndex = -1;
    for (let i = objStartIndex; i < content.length; i++) {
      if (content[i] === '{') depth++;
      else if (content[i] === '}') {
        depth--;
        if (depth === 0) {
          objEndIndex = i;
          break;
        }
      }
    }

    if (objEndIndex === -1) return false;

    // Build formatted place object string
    const formattedCode = formatPlaceToTypeScript(updatedPlace);

    const newContent = content.substring(0, objStartIndex) + formattedCode + content.substring(objEndIndex + 1);
    fs.writeFileSync(filePath, newContent, 'utf8');
    return true;
  } catch (err) {
    console.error('Error saving updated place:', err);
    return false;
  }
}

export function saveNewPlace(newPlace: PlaceItem): boolean {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'mockData.ts');
    if (!fs.existsSync(filePath)) return false;

    let content = fs.readFileSync(filePath, 'utf8');
    const endArrayMatch = content.indexOf('export const INITIAL_ALERTS');
    if (endArrayMatch === -1) return false;

    // Find the last "];" before INITIAL_ALERTS
    const closeArrayBracket = content.lastIndexOf('];', endArrayMatch);
    if (closeArrayBracket === -1) return false;

    const formattedCode = `,\n  ${formatPlaceToTypeScript(newPlace)}\n`;
    const newContent = content.substring(0, closeArrayBracket) + formattedCode + content.substring(closeArrayBracket);
    fs.writeFileSync(filePath, newContent, 'utf8');
    return true;
  } catch (err) {
    console.error('Error adding new place:', err);
    return false;
  }
}

export function deletePlaceFromMockData(placeId: string): boolean {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'mockData.ts');
    if (!fs.existsSync(filePath)) return false;

    let content = fs.readFileSync(filePath, 'utf8');

    const idNeedle = `id: '${placeId}'`;
    const idIndex = content.indexOf(idNeedle);
    if (idIndex === -1) return false;

    const objStartIndex = content.lastIndexOf('{', idIndex);
    if (objStartIndex === -1) return false;

    let depth = 0;
    let objEndIndex = -1;
    for (let i = objStartIndex; i < content.length; i++) {
      if (content[i] === '{') depth++;
      else if (content[i] === '}') {
        depth--;
        if (depth === 0) {
          objEndIndex = i;
          break;
        }
      }
    }

    if (objEndIndex === -1) return false;

    // Check if there is a trailing comma or leading comma
    let removeEnd = objEndIndex + 1;
    if (content[removeEnd] === ',') removeEnd++;

    const newContent = content.substring(0, objStartIndex).trimEnd() + content.substring(removeEnd);
    fs.writeFileSync(filePath, newContent, 'utf8');
    return true;
  } catch (err) {
    console.error('Error deleting place:', err);
    return false;
  }
}

function formatPlaceToTypeScript(p: PlaceItem): string {
  const photosArray = (p.photos || []).map(photo => `      '${photo}'`).join(',\n');
  const tagsArray = (p.tags || []).map(t => `'${t}'`).join(', ');
  const badgesArray = (p.badges || []).map(b => `'${b}'`).join(', ');

  return `{\n    id: '${p.id}',\n    slug: '${p.slug || p.id}',\n    name: ${JSON.stringify(p.name)},\n    category: '${p.category}',\n    subCategory: ${JSON.stringify(p.subCategory || '')},\n    commune: ${JSON.stringify(p.commune)},\n    description: ${JSON.stringify(p.description || '')},\n    coords: [${p.coords[0]}, ${p.coords[1]}],\n    photos: [\n${photosArray}\n    ],\n    rating: ${p.rating || 4.8},\n    reviewsCount: ${p.reviewsCount || 100},\n    featured: ${!!p.featured},\n    isHiddenGem: ${!!p.isHiddenGem},\n    crowdLevel: ${p.crowdLevel ? `'${p.crowdLevel}'` : `'Modérée'`},\n    parking: ${p.parking ? `'${p.parking}'` : `'Facile et gratuit'`},\n    toilets: ${!!p.toilets},\n    restaurantsNearby: ${!!p.restaurantsNearby},\n    website: ${p.website ? JSON.stringify(p.website) : `'https://martinique-explorer.fr'`},\n    phone: ${p.phone ? JSON.stringify(p.phone) : `'+596 596 00 00 00'`},\n    address: ${p.address ? JSON.stringify(p.address) : `''`},\n    schedules: ${p.schedules ? JSON.stringify(p.schedules) : `'Tous les jours'`},\n    priceRange: ${p.priceRange ? JSON.stringify(p.priceRange) : `'€€'`},\n    tags: [${tagsArray}],\n    badges: [${badgesArray}]\n  }`;
}
