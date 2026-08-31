/**
 * REC-1/REC-4 — picks the best-matching YouTube candidate for the user's
 * remaining calorie target/equipment using Gemini, since YouTube's own
 * metadata has no structured "calories burned"/intensity field to filter on
 * (see docs/02-design/02-technical/detailed-design/02-daily-youtube-recommendation.md's
 * matching/widen-retry algorithm — this is that matching step).
 */
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod/v4';
import type { ActivityType, EquipmentType, Intensity } from '@smartfit/shared-types';
import type { YoutubeCandidate } from './youtube';

const ai = new GoogleGenAI({}); // reads GEMINI_API_KEY (or GOOGLE_API_KEY)

const PickedVideoSchema = z.object({
  externalVideoId: z.string(),
  activityType: z.enum(['cardio', 'strength', 'hiit']),
  intensity: z.enum(['low', 'medium', 'high']),
  includesWarmupCooldown: z.boolean(),
});

/**
 * kcal = MET × น้ำหนักตัว(kg) × เวลา(ชม.) per REQ-05 — mirrors
 * WorkoutSessionScreen.tsx's MET_TABLE exactly, so the "≈ X kcal" shown on
 * the dashboard before starting matches what a completed session actually
 * logs. Deliberately independent of the user's remaining/goal kcal — this
 * is what the video itself burns, not a number picked to fit the goal.
 */
const MET_TABLE: Record<PickedVideo['activityType'], Record<PickedVideo['intensity'], number>> = {
  cardio: { low: 4, medium: 6, high: 8 },
  strength: { low: 3, medium: 4.5, high: 6 },
  hiit: { low: 6, medium: 8, high: 10 },
};

export interface PickedVideo {
  externalVideoId: string;
  title: string;
  durationMinutes: number;
  activityType: ActivityType;
  intensity: Intensity;
  estimatedKcal: number;
  includesWarmupCooldown: boolean;
}

/**
 * Uses Gemini to pick one candidate best matching `remainingKcal`/`equipmentTypes`
 * and estimate its intensity/calorie burn from title+description+duration alone.
 * Returns null only when there are no candidates to choose from at all, or
 * Gemini's response doesn't parse — the exact "no good enough match" tolerance
 * (api-spec.md §4 item 1) is still an open point, so this is deliberately
 * best-effort rather than a hard reject.
 */
export async function pickBestVideo(
  candidates: YoutubeCandidate[],
  remainingKcal: number,
  equipmentTypes: EquipmentType[],
  weightKg: number,
): Promise<PickedVideo | null> {
  if (candidates.length === 0) return null;

  const response = await ai.models.generateContent({
    // Pro-tier models (gemini-3.1-pro-preview, etc.) have zero free-tier
    // quota — Flash is the tier actually available without billing enabled,
    // and is plenty capable for ranking a handful of video candidates.
    model: 'gemini-3.6-flash',
    contents: `You are picking one workout video for a fitness app user, from real YouTube search results.

Remaining calorie target for today: ${remainingKcal} kcal.
Equipment available: ${equipmentTypes.length > 0 ? equipmentTypes.join(', ') : 'none'}.

Only pick a video whose equipment needs (inferred from its title/description) match what's available — if equipment is "none", only pick bodyweight/no-equipment videos. Estimate intensity from the title, description, and duration alone (view/like counts aren't shown and shouldn't factor in) — pick whichever intensity best fits the remaining calorie target.

Candidates:
${JSON.stringify(
  candidates.map((c) => ({
    id: c.externalVideoId,
    title: c.title,
    description: c.description,
    durationMinutes: c.durationMinutes,
  })),
)}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: z.toJSONSchema(PickedVideoSchema),
    },
  });

  if (!response.text) return null;

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(response.text);
  } catch {
    return null;
  }

  const parsed = PickedVideoSchema.safeParse(parsedJson);
  if (!parsed.success) return null;

  const candidate = candidates.find((c) => c.externalVideoId === parsed.data.externalVideoId);
  if (!candidate) return null; // guard against a hallucinated id

  const metValue = MET_TABLE[parsed.data.activityType][parsed.data.intensity];
  const estimatedKcal = Math.round(metValue * weightKg * (candidate.durationMinutes / 60));

  return {
    externalVideoId: parsed.data.externalVideoId,
    title: candidate.title,
    durationMinutes: candidate.durationMinutes,
    activityType: parsed.data.activityType,
    intensity: parsed.data.intensity,
    estimatedKcal,
    includesWarmupCooldown: parsed.data.includesWarmupCooldown,
  };
}
