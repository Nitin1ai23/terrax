/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#080C10',
        surface: '#0F1519',
        'surface-2': '#131B21',
        border: '#1E2A33',
        topo: '#2AFFA0',
        data: '#FF6B35',
        'text-primary': '#E8EDF2',
        'text-muted': '#6B7F8C',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
      },
      spacing: {
        // 8px base scale is the default Tailwind 2/4 unit; explicit anchors below
        18: '4.5rem',
      },
      maxWidth: {
        content: '1200px',
      },
      keyframes: {
        'contour-drift': {
          '0%, 100%': { transform: 'translateY(0) scale(1)', opacity: '0.5' },
          '50%': { transform: 'translateY(-12px) scale(1.015)', opacity: '0.8' },
        },
        'pulse-ring': {
          '0%': { strokeDashoffset: '0' },
          '100%': { strokeDashoffset: '-1000' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'contour-drift': 'contour-drift 14s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 40s linear infinite',
        'fade-up': 'fade-up 0.6s cubic-bezier(0.22,1,0.36,1) both',
      },
    },
  },
  plugins: [],
}
