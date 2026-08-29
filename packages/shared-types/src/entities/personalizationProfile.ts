/**
 * Personalization & Profile (HLA §3.2) — ONB-1/2/3 / REQ-01, 02, 03
 * Source of truth: docs/02-design/02-technical/database-schema.md §3.2-3.4
 */

export type Sex = 'female' | 'male';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export type GoalType = 'lose_weight' | 'tone_up' | 'build_endurance';
export type EquipmentType = 'none' | 'dumbbell' | 'full_gym';

export interface UserProfile {
  id: string;
  userAccountId: string; // FK -> UserAccount.id, unique 1:1
  age: number;
  sex: Sex;
  weightKg: number;
  heightCm: number;
  activityLevel: ActivityLevel;
  tdeeKcal: number;
}

export interface GoalSelection {
  id: string;
  userProfileId: string; // FK -> UserProfile.id, 1:1 (current goal only)
  goalType: GoalType;
  /** Required when goalType === 'lose_weight'. */
  targetWeightKg?: number;
  dailyCalorieTargetKcal: number;
  isSafetyFloorApplied: boolean;
}

export interface EquipmentSelection {
  id: string;
  userProfileId: string; // FK -> UserProfile.id (multi-row, multi-select)
  equipmentType: EquipmentType;
}
