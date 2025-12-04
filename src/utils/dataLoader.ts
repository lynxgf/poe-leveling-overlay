import type { LevelingData } from '../types/leveling';
import type { GameVersion } from './storage';

let cachedDataPoe1: LevelingData | undefined;
let cachedDataPoe2: LevelingData | undefined;

export async function loadLevelingData(gameVersion: GameVersion = 'poe2'): Promise<LevelingData> {
  // Check cache first
  if (gameVersion === 'poe1' && cachedDataPoe1) {
    return cachedDataPoe1;
  }
  if (gameVersion === 'poe2' && cachedDataPoe2) {
    return cachedDataPoe2;
  }

  try {
    let data: any;
    
    if (gameVersion === 'poe1') {
      data = await import('../data/leveling-data-poe1-v2.json');
      cachedDataPoe1 = (data.default || data) as LevelingData;
      return cachedDataPoe1;
    } else {
      data = await import('../data/leveling-data-poe2-v2.json');
      cachedDataPoe2 = (data.default || data) as LevelingData;
      return cachedDataPoe2;
    }
  } catch (error) {
    console.error(`Failed to load leveling data for ${gameVersion}:`, error);
    throw error;
  }
}

export function getCachedData(gameVersion: GameVersion = 'poe2'): LevelingData | undefined {
  return gameVersion === 'poe1' ? cachedDataPoe1 : cachedDataPoe2;
}

export function clearCache(): void {
  cachedDataPoe1 = undefined;
  cachedDataPoe2 = undefined;
}