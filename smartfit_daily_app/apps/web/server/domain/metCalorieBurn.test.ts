import { describe, expect, it } from 'vitest';
import { computeMetCalorieBurnKcal, selectActualCalorieBurn } from './metCalorieBurn';

describe('computeMetCalorieBurnKcal (REC-2 / REQ-05 — kcal = MET × weightKg × hours)', () => {
  it('TC-REC-2-001 — cardio medium (MET 6.0), 70kg, 30 real minutes → 210 kcal', () => {
    expect(computeMetCalorieBurnKcal(6.0, 70, 30)).toBe(210);
  });

  it('TC-REC-2-002 — HIIT high (MET 10.0), 60kg, 20 real minutes → 200 kcal', () => {
    expect(computeMetCalorieBurnKcal(10.0, 60, 20)).toBe(200);
  });

  it('TC-REC-2-003 — stopped early: only the 24 real minutes count (not the full 45-minute video) → 150 kcal', () => {
    // MET 5.0 (strength/medium, test-case-chosen value), 75kg, 24 real minutes.
    expect(computeMetCalorieBurnKcal(5.0, 75, 24)).toBe(150);
    // Explicitly NOT the full-video-length result the algorithm must avoid.
    expect(computeMetCalorieBurnKcal(5.0, 75, 45)).not.toBe(150);
  });

  it('TC-REC-4-003 — main segment of a HIIT high-intensity session (MET 10.0), 60kg, 20 real minutes → 200 kcal (same formula/result as TC-REC-2-002)', () => {
    expect(computeMetCalorieBurnKcal(10.0, 60, 20)).toBe(200);
  });
});

describe('selectActualCalorieBurn (REC-2 / REQ-05, INT-3 / REQ-13 — wearable reading preferred over the MET estimate)', () => {
  it('TC-REC-2-001 — no wearable reading connected → uses the MET-formula estimate', () => {
    const calculatedKcal = computeMetCalorieBurnKcal(6.0, 70, 30);
    expect(selectActualCalorieBurn(undefined, calculatedKcal)).toEqual({
      source: 'met_formula',
      calculatedKcal: 210,
    });
  });

  it('TC-REC-2-004 — wearable reading (255 kcal) present → overrides the ≈238 kcal MET estimate', () => {
    const metEstimateKcal = computeMetCalorieBurnKcal(6.0, 68, 35); // ≈238 kcal
    expect(selectActualCalorieBurn(255, metEstimateKcal)).toEqual({
      source: 'wearable',
      calculatedKcal: 255,
    });
  });
});
