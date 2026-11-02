/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        studio: {
          red: '#E5322B',
          redHover: '#CF251F',
          redGlow: 'rgba(229, 50, 43, 0.25)',
          backdropTop: '#C1272D',
          backdropBottom: '#0A0A0A',
          dark: '#0B0B0B',
          cardDark: '#121212',
          cardSubtle: '#18181A',
          cardHover: '#202023',
          borderDark: 'rgba(255, 255, 255, 0.12)',
          borderLight: 'rgba(0, 0, 0, 0.08)',
          light: '#FFFFFF',
          cardLight: '#F7F7F8',
          headlineGrey: '#9A9A9A',
          muted: '#71717A',
          faint: '#A1A1AA',
          // Status colors
          statusActive: '#10B981',       // Mint Green
          statusActiveBg: 'rgba(16, 185, 129, 0.12)',
          statusCompleted: '#3B82F6',    // Blue
          statusCompletedBg: 'rgba(59, 130, 246, 0.12)',
          statusOnHold: '#F59E0B',       // Amber
          statusOnHoldBg: 'rgba(245, 158, 11, 0.12)'
        }
      },
      fontFamily: {
        sans: ['Geist', 'General Sans', 'Satoshi', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace']
      },
      borderRadius: {
        '2.5xl': '20px',
        '3xl': '24px',
        '4xl': '28px'
      },
      boxShadow: {
        'card-dark': '0 20px 40px -15px rgba(0, 0, 0, 0.7)',
        'glow-red': '0 0 25px rgba(229, 50, 43, 0.35)',
        'paper': '0 10px 30px -10px rgba(0, 0, 0, 0.2)'
      }
    }
  },
  plugins: []
};

