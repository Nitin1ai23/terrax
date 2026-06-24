export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <rect width="32" height="32" rx="4" fill="#0F1519" stroke="#1E2A33" />
        <g fill="none" stroke="#2AFFA0" strokeWidth="1.4" strokeLinecap="round">
          <path d="M5 23 Q11 14 16 18 T28 13" />
          <path d="M5 27 Q11 20 16 24 T28 19" opacity="0.6" />
          <path d="M6 18 Q12 10 16 13 T26 8" opacity="0.85" />
        </g>
        <circle cx="16" cy="16" r="1.4" fill="#2AFFA0" />
      </svg>
      <span className="font-display font-bold text-lg tracking-tight">TERRAX</span>
    </div>
  )
}
