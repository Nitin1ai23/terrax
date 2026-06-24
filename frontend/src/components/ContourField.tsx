import { useMemo } from 'react'

// Signature element: a procedurally generated topographic contour field.
// Concentric "elevation" rings around a few peaks, drawn as smooth closed
// SVG paths. Lines drift slowly to suggest live elevation data in motion.
// Not a stock image, not a gradient — the brand mark, animated.

interface Peak {
  cx: number
  cy: number
  baseR: number
  wobble: number
  rings: number
}

const PEAKS: Peak[] = [
  { cx: 320, cy: 300, baseR: 34, wobble: 0.22, rings: 11 },
  { cx: 880, cy: 240, baseR: 28, wobble: 0.3, rings: 9 },
  { cx: 1140, cy: 560, baseR: 40, wobble: 0.18, rings: 12 },
  { cx: 560, cy: 640, baseR: 24, wobble: 0.34, rings: 8 },
]

// Build a smooth closed path for one contour ring using sampled radii.
function ringPath(peak: Peak, level: number, seed: number): string {
  const steps = 64
  const r = peak.baseR + level * 26
  const pts: [number, number][] = []
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2
    // Layered sinusoids stand in for terrain noise — deterministic per seed.
    const n =
      Math.sin(a * 3 + seed) * peak.wobble +
      Math.sin(a * 5 - seed * 1.7) * peak.wobble * 0.5 +
      Math.sin(a * 2 + level * 0.6) * peak.wobble * 0.4
    const rr = r * (1 + n)
    pts.push([peak.cx + Math.cos(a) * rr, peak.cy + Math.sin(a) * rr * 0.78])
  }
  // Catmull-Rom → cubic Bézier for smoothness.
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? i : i - 1]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2 >= pts.length ? i + 1 : i + 2]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d + ' Z'
}

export default function ContourField({ className = '' }: { className?: string }) {
  const peaks = useMemo(
    () =>
      PEAKS.map((peak, pi) => ({
        peak,
        rings: Array.from({ length: peak.rings }, (_, level) => ({
          level,
          d: ringPath(peak, level, pi * 2.3 + 1),
          // Inner rings (higher elevation) are brighter.
          opacity: 0.08 + (1 - level / peak.rings) * 0.5,
        })),
      })),
    [],
  )

  return (
    <svg
      className={className}
      viewBox="0 0 1440 760"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="topoGlow" cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#0F1519" stopOpacity="0" />
          <stop offset="100%" stopColor="#080C10" stopOpacity="0.9" />
        </radialGradient>
      </defs>

      {/* Faint baseline grid — survey reference feel */}
      <g stroke="#1E2A33" strokeWidth="0.5" opacity="0.5">
        {Array.from({ length: 15 }, (_, i) => (
          <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="760" />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 100} x2="1440" y2={i * 100} />
        ))}
      </g>

      {peaks.map(({ peak, rings }, pi) => (
        <g
          key={pi}
          className="animate-contour-drift"
          style={{ animationDelay: `${pi * 1.6}s`, transformOrigin: `${peak.cx}px ${peak.cy}px` }}
        >
          {rings.map((ring) => (
            <path
              key={ring.level}
              d={ring.d}
              fill="none"
              stroke="#2AFFA0"
              strokeWidth={ring.level === 0 ? 1.4 : 0.8}
              opacity={ring.opacity}
            />
          ))}
          {/* Peak marker */}
          <circle cx={peak.cx} cy={peak.cy} r="2" fill="#2AFFA0" opacity="0.9" />
        </g>
      ))}

      <rect width="1440" height="760" fill="url(#topoGlow)" />
    </svg>
  )
}
