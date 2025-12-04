import type { StepType } from '../types/leveling';

const ICON_MAP: Record<string, string> = {
  'arrow-right': '➜',
  'waypoint': '⚑',
  'home': '🏛',
  'chat': '💬',
  'exclamation': '❗',
  'skull': '☠',
  'lab': '⚗',
  'star': '★',
  'info': 'ℹ',
};

const STEP_TYPE_CONFIG: Record<StepType, { icon: string; color: string }> = {
  navigation: { icon: 'arrow-right', color: '#E0E0E0' },
  waypoint: { icon: 'waypoint', color: '#00D4FF' },
  town: { icon: 'home', color: '#FEC076' },
  npc_quest: { icon: 'chat', color: '#FFB84D' },
  quest: { icon: 'exclamation', color: '#FFEB3B' },
  kill_boss: { icon: 'skull', color: '#FF5252' },
  trial: { icon: 'lab', color: '#4ADE80' },
  passive: { icon: 'star', color: '#4ADE80' },
  optional: { icon: 'info', color: '#9E9E9E' },
};

export function getStepIcon(type: StepType): string {
  const config = STEP_TYPE_CONFIG[type];
  if (!config) return '•';
  return ICON_MAP[config.icon] || '•';
}

export function getStepColor(type: StepType): string {
  const config = STEP_TYPE_CONFIG[type];
  return config?.color || '#FFFFFF';
}

