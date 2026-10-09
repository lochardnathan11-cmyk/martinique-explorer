import fs from 'fs';
import path from 'path';
import { INITIAL_PLACES } from '@/data/mockData';

export function getAllSpots() {
  return INITIAL_PLACES;
}

export function updateSpotPhotosInMockData(spotId: string, photos: string[]): boolean {
  try {
    const filePath = path.join(process.cwd(), 'src', 'data', 'mockData.ts');
    if (!fs.existsSync(filePath)) return false;

    let content = fs.readFileSync(filePath, 'utf8');

    // Find the place with id: 'spotId'
    const idNeedle = `id: '${spotId}'`;
    const idIndex = content.indexOf(idNeedle);
    if (idIndex === -1) {
      console.warn(`Spot id "${spotId}" not found in mockData.ts`);
      return false;
    }

    // Look for photos: [ ... ] right after this spot's id
    const afterId = content.substring(idIndex);
    const photosMatch = afterId.match(/photos:\s*\[([\s\S]*?)\]/);
    if (!photosMatch || photosMatch.index === undefined) {
      console.warn(`Photos array not found for spot "${spotId}"`);
      return false;
    }

    const formattedPhotos = photos.map(p => `      '${p}'`).join(',\n');
    const replacement = `photos: [\n${formattedPhotos}\n    ]`;

    const replaceStartIndex = idIndex + photosMatch.index;
    const replaceEndIndex = replaceStartIndex + photosMatch[0].length;

    const newContent = content.substring(0, replaceStartIndex) + replacement + content.substring(replaceEndIndex);
    fs.writeFileSync(filePath, newContent, 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to update mockData.ts:', err);
    return false;
  }
}
