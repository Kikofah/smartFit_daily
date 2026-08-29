import { colors } from '../constants/theme';

/**
 * Line icons ported 1:1 from the inline SVGs already used across
 * docs/02-design/01-prototypes/v1/*.html (DESIGN.md §1.4/§2.5 — 1.5px
 * stroke, no filled/gradient/3D icons). Kept as plain SVG JSX (not a
 * react-native Image) since this is a web-only client rendered by
 * react-dom — react-native-web's View/Text aliasing doesn't apply to
 * raw DOM tags like <svg>.
 */
export interface IconProps {
  size?: number;
  color?: string;
}

const base = (size: number, color: string) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none' as const,
  stroke: color,
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export function IconHome({ size = 22, color = colors.inkMuted }: IconProps) {
  return (
    <svg {...base(size, color)}>
      <path d="M4 11l8-7 8 7" />
      <path d="M6 10v9a1 1 0 0 0 1 1h4v-6h2v6h4a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function IconPlanner({ size = 22, color = colors.inkMuted }: IconProps) {
  return (
    <svg {...base(size, color)}>
      <rect x="4" y="5" width="16" height="15" rx="2" />
      <path d="M4 9h16" />
      <path d="M8 3v4M16 3v4" />
    </svg>
  );
}

export function IconProgress({ size = 22, color = colors.inkMuted }: IconProps) {
  return (
    <svg {...base(size, color)}>
      <path d="M4 20V10M11 20V4M18 20v-7" />
    </svg>
  );
}

export function IconProfile({ size = 22, color = colors.inkMuted }: IconProps) {
  return (
    <svg {...base(size, color)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
    </svg>
  );
}

export function IconFlame({ size = 20, color = colors.inkFaint }: IconProps) {
  return (
    <svg {...base(size, color)}>
      <path d="M12 2c1 3-2 4-2 7a3 3 0 1 0 6 0c0-1-0.5-2-1-2.5 1.5 0.5 3 2.5 3 5.5a6 6 0 1 1-12 0c0-4 2-5 3-7 0.5-1 1-2 1-3z" />
    </svg>
  );
}

export function IconCheck({ size = 16, color = colors.sage }: IconProps) {
  return (
    <svg {...base(size, color)}>
      <polyline points="4 12 10 18 20 6" />
    </svg>
  );
}

export function IconDashedCircle({ size = 16, color = colors.sand }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeDasharray="3 3">
      <circle cx="12" cy="12" r="8" />
    </svg>
  );
}

export function IconPlay({ size = 40, color = colors.inkFaint }: IconProps) {
  return (
    <svg {...base(size, color)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M10 9l5 3-5 3V9z" fill={color} stroke="none" />
    </svg>
  );
}
