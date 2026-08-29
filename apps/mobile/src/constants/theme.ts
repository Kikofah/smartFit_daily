/**
 * Design tokens ported 1:1 from docs/02-design/01-prototypes/DESIGN.md §2.
 * Keep this file in sync with DESIGN.md — it is the single source of truth,
 * this is just its React Native representation.
 */

export const colors = {
  // Neutrals — Paper & Ink
  paper: '#F6F2EA',
  paperAlt: '#EFE9DC',
  paperSunken: '#E7DFCF',
  ink: '#33302A',
  inkMuted: '#6B6459',
  inkFaint: '#9C9484',
  border: '#DAD2C1',
  borderStrong: '#C4B9A2',

  // Brand & Accent — never more than one accent color dominant per screen (DESIGN.md §2.1 rule 2)
  clay: '#B4694C',
  clayStrong: '#9C5940',
  sage: '#7E8F6C',
  sageStrong: '#687858',
  sand: '#C9A26B',

  // Semantic
  success: '#7E8F6C', // = sage
  warning: '#BE9A4D',
  /** Reserved for real form/system errors. Never use for the user's "goal not met" state — see DESIGN.md §4.2. */
  danger: '#A85A45',
  info: '#7A8B86',
} as const;

export const spacing = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  12: 48,
  16: 64,
} as const;

export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
} as const;

export const typography = {
  display: { fontSize: 28, lineHeight: 36, fontWeight: '600' as const },
  h1: { fontSize: 22, lineHeight: 30, fontWeight: '600' as const },
  h2: { fontSize: 18, lineHeight: 26, fontWeight: '500' as const },
  h3: { fontSize: 16, lineHeight: 22, fontWeight: '500' as const },
  body: { fontSize: 15, lineHeight: 22, fontWeight: '400' as const },
  bodySm: { fontSize: 13, lineHeight: 18, fontWeight: '400' as const },
  caption: { fontSize: 12, lineHeight: 16, fontWeight: '500' as const },
} as const;
