/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ─── Soft Industrial Palette ───
        // Cream surfaces (paper / linen / bone)
        cream: {
          50:  '#FDFBF6',
          100: '#F8F4EC',
          200: '#EFE8DB',
          300: '#E2D8C5',
          400: '#C9BCA2',
          500: '#A89A7E',
        },
        // Ink — wired to CSS vars so utility classes auto-flip in dark mode.
        // Fixed fallbacks (e.g. ink-200/400/600/800) kept for special cases.
        ink: {
          900: 'var(--ink-900)',
          700: 'var(--ink-700)',
          500: 'var(--ink-500)',
          300: 'var(--ink-300)',
          800: '#231D32',
          600: '#4F4760',
          400: '#8A8294',
          200: '#D5CFC0',
          100: '#ECE6D9',
        },
        // Iris — primary accent (deep violet). Class kept as "clay" to avoid
        // touching every component; the *values* are violet now.
        clay: {
          50:  '#EFEAFB',
          100: '#DCD0F4',
          200: '#B49EE6',
          300: '#8C6DD6',
          400: '#6E4DC8',
          500: '#5839B8',   // PRIMARY — deep iris
          600: '#46299A',
          700: '#341C77',
          800: '#221153',
          900: '#140A36',
        },
        // Moss — success / AI signal (sage green)
        moss: {
          50:  '#EDF1E5',
          100: '#D3DDBE',
          200: '#A8BB87',
          300: '#85A05F',
          400: '#6B8A4B',
          500: '#5C7548',
          600: '#475C39',
          700: '#34442B',
          800: '#222D1C',
        },
        // Ochre — warning / metadata
        ochre: {
          100: '#F5E8C8',
          300: '#E2C57A',
          500: '#C89A3F',
          700: '#8C6A22',
        },
        // Brick — error / urgent
        brick: {
          50:  '#FBE8E5',
          100: '#F2C4BC',
          300: '#D27466',
          500: '#9C3A2C',
          700: '#6E251B',
        },
        // Semantic aliases — all wired to CSS vars so they invert automatically
        primary:   'var(--clay)',
        'on-primary': '#FDFBF6',
        accent:    'var(--moss)',
        background: 'var(--bg)',
        surface:    'var(--surface)',
        'surface-raised': 'var(--raised)',
        'on-surface': 'var(--ink-900)',
        outline: 'var(--outline)',
        'outline-soft': 'var(--outline-soft)',
        success: 'var(--moss)',
        warning: 'var(--ochre)',
        error:   'var(--brick)',
      },
      borderRadius: {
        none: '0',
        xs: '2px',
        sm: '4px',
        DEFAULT: '6px',
        md: '6px',
        lg: '10px',
        xl: '14px',
        '2xl': '20px',
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '40px',
        '2xl': '64px',
      },
      fontFamily: {
        // Display: variable serif with optical sizing
        display: ['"Fraunces"', 'ui-serif', 'Georgia', 'serif'],
        // Body: humanist grotesque — alt to Söhne
        sans: ['"Inter Tight"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Numerics / labels — industrial mono
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        // Editorial scale — display dominates, body recedes
        'display-xl': ['72px', { lineHeight: '1', letterSpacing: '-0.04em', fontWeight: '500' }],
        'display-lg': ['56px', { lineHeight: '1.02', letterSpacing: '-0.035em', fontWeight: '500' }],
        'display-md': ['40px', { lineHeight: '1.08', letterSpacing: '-0.03em', fontWeight: '500' }],
        'headline-lg': ['28px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '600' }],
        'headline-md': ['22px', { lineHeight: '1.25', letterSpacing: '-0.015em', fontWeight: '600' }],
        'headline-sm': ['18px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '1.55', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '1.55', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        'label-md': ['12px', { lineHeight: '1.3', letterSpacing: '0.06em', fontWeight: '600' }],
        'label-sm': ['11px', { lineHeight: '1.3', letterSpacing: '0.08em', fontWeight: '600' }],
        'mono-sm': ['12px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '500' }],
        'mono-xs': ['10.5px', { lineHeight: '1.3', letterSpacing: '0.04em', fontWeight: '500' }],
      },
      boxShadow: {
        // Warm-tinted shadows (soft sepia, not pure black)
        'paper': '0 1px 0 rgb(58 26 15 / 0.04), 0 1px 2px rgb(58 26 15 / 0.04)',
        'card':  '0 1px 2px rgb(58 26 15 / 0.04), 0 2px 8px rgb(58 26 15 / 0.05)',
        'lift':  '0 4px 8px rgb(58 26 15 / 0.06), 0 12px 24px rgb(58 26 15 / 0.08)',
        'inset-soft': 'inset 0 1px 0 rgb(255 255 255 / 0.6), inset 0 -1px 0 rgb(58 26 15 / 0.04)',
      },
      animation: {
        'fade-in':    'fade-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'fade-in-fast': 'fade-in 0.25s ease-out forwards',
        'slide-up':   'slide-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'rise':       'rise 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'rise': {
          '0%': { opacity: '0', transform: 'translateY(28px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.55' },
        },
      },
      maxWidth: {
        'max-width': '1320px',
      },
    },
  },
  plugins: [],
}
