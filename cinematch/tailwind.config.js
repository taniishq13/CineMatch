/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Georgia', 'Times New Roman', 'serif'],
        body: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        film: {
          black: '#0F0F0F',
          void: '#0F0F0F',
          surface: '#1A1A1A',
          card: '#2A2A2A',
          border: '#333333',
          amber: '#FF6B35',
          gold: '#D4AF37',
          ember: '#FF8A5B',
          ice: '#93C5FD',
          muted: '#7A7A7A',
          soft: '#B8B8B8',
          text: '#FFFFFF',
          white: '#FFFFFF',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease forwards',
        'fade-down': 'fadeDown 0.8s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'shimmer': 'shimmer 1.8s infinite linear',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'scale-in': 'scaleIn 0.3s ease forwards',
      },
      keyframes: {
        fadeDown: {
          from: { opacity: 0, transform: 'translateY(-15px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeUp: {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-700px 0' },
          '100%': { backgroundPosition: '700px 0' },
        },
        scaleIn: {
          from: { opacity: 0, transform: 'scale(0.95)' },
          to: { opacity: 1, transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'film-grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
