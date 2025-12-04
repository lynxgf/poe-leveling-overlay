const PROGRESS_KEY_PREFIX = 'poe-leveling-progress-';
const SETTINGS_KEY = 'poe-leveling-settings';

export type GameVersion = 'poe1' | 'poe2';

export interface LevelingSettings {
  visibleSteps: number;
  showHints: boolean;
  showOptional: boolean;
  currentAct: number;
  gameVersion: GameVersion;
}

const DEFAULT_SETTINGS: LevelingSettings = {
  visibleSteps: 5,
  showHints: true,
  showOptional: true,
  currentAct: 1,
  gameVersion: 'poe2',
};

export function saveProgress(completedSteps: Set<string>, gameVersion: GameVersion = 'poe2'): void {
  try {
    localStorage.setItem(`${PROGRESS_KEY_PREFIX}${gameVersion}`, JSON.stringify(Array.from(completedSteps)));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

export function loadProgress(gameVersion: GameVersion = 'poe2'): Set<string> {
  try {
    const saved = localStorage.getItem(`${PROGRESS_KEY_PREFIX}${gameVersion}`);
    if (saved) {
      return new Set(JSON.parse(saved));
    }
  } catch (error) {
    console.error('Failed to load progress:', error);
  }
  return new Set();
}

export function saveSettings(settings: LevelingSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
}

export function loadSettings(): LevelingSettings {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return { ...DEFAULT_SETTINGS };
}

/**
 * Сбрасывает прогресс для указанной версии игры.
 * По умолчанию сбрасывает прогресс для 'poe2'.
 */
export function resetProgress(gameVersion: GameVersion = 'poe2'): void {
  try {
    localStorage.removeItem(`${PROGRESS_KEY_PREFIX}${gameVersion}`);
  } catch (error) {
    console.error('Failed to reset progress:', error);
  }
}