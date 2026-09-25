import { describe, expect, it } from 'vitest';
import { computeTdeeKcal } from './tdee';

describe('computeTdeeKcal (ONB-1 / REQ-01)', () => {
  it('TC-ONB-1-001 — male, age 30, 75kg, 175cm, moderate activity → 2,633 kcal/day', () => {
    expect(computeTdeeKcal('male', 75, 175, 30, 'moderate')).toBe(2633);
  });

  it('TC-ONB-1-002 — female, age 28, 60kg, 165cm, light activity → 1,829 kcal/day', () => {
    expect(computeTdeeKcal('female', 60, 165, 28, 'light')).toBe(1829);
  });

  it('TC-ONB-3-005/008 precondition — female, age 70, 32kg, 135cm, sedentary → 783 kcal/day', () => {
    expect(computeTdeeKcal('female', 32, 135, 70, 'sedentary')).toBe(783);
  });
});
