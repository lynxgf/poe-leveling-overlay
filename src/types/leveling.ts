export type StepType = 
  | 'kill_boss'
  | 'town'
  | 'npc_quest'
  | 'navigation'
  | 'waypoint'
  | 'quest'
  | 'optional'
  | 'passive'
  | 'trial';

export interface LevelingStep {
  id: string;
  type: StepType;
  zone: string;
  description: string;
  hint?: string;
  layoutTip?: string;
  quest?: string;
  reward?: string;
  recommendedLevel?: number | null;
  optionalNote?: string;
  checkable: boolean;
  zoneId?: string;
  nextZoneId?: string;
  checked?: boolean;
}

export interface LevelingAct {
  actNumber: number;
  actName: string;
  recommendedEndLevel?: number;
  steps: LevelingStep[];
}

export interface StepTypeConfig {
  icon: string;
  color: string;
  label: string;
}

export interface LevelingData {
  acts: LevelingAct[];
  stepTypes?: Record<string, StepTypeConfig>;
}

export interface GroupedStep {
  zone: string;
  zoneId?: string;
  steps: LevelingStep[];
  allChecked: boolean;
  layoutTip?: string;
}

