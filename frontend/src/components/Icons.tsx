// Outlined SVG icons, 20px default, currentColor stroke — design rule #7.
import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: number }

function base({ size = 20, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...props,
  }
}

export const Crane = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 21V4M6 4h12l-2 4M6 4 4 8M16 8v3M16 11l-3 0M13 11v3" />
    <rect x="4" y="21" width="8" height="0" />
    <path d="M4 21h6" />
  </svg>
)

export const Terrain = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 18 9 8l4 6 3-4 5 8" />
    <path d="M3 21h18" strokeDasharray="2 2" />
  </svg>
)

export const Drone = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="6" cy="6" r="2.5" />
    <circle cx="18" cy="6" r="2.5" />
    <rect x="9" y="10" width="6" height="4" rx="1" />
    <path d="M6 8.5v1.5M18 8.5v1.5M10 14l-2 4M14 14l2 4" />
  </svg>
)

export const Search = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

export const Arrow = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

export const Layers = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m12 3 9 5-9 5-9-5 9-5Z" />
    <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
  </svg>
)

export const Chart = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3 3v18h18" />
    <path d="M7 14l3-4 3 2 4-6" />
  </svg>
)

export const Cube = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" />
    <path d="M4 7l8 4 8-4M12 11v10" />
  </svg>
)

export const Sparkle = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 3v4M12 17v4M5 12H1M23 12h-4M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export const Doc = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M14 3H6v18h12V7l-4-4Z" />
    <path d="M14 3v4h4M9 13h6M9 17h6" />
  </svg>
)

export const Lock = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="4" y="10" width="16" height="11" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
)

export const Grid = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)

export const Upload = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
    <path d="M12 15V3M8 7l4-4 4 4" />
  </svg>
)

export const Menu = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 6h16M4 12h16M4 18h16" />
  </svg>
)

export const Close = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)
