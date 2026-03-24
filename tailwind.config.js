/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx}',
    './public/**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        'glass-light': 'rgba(255,255,255,0.2)',
        'glass-medium': 'rgba(40,40,50,0.4)',
        'glass-dark': 'rgba(0,0,0,0.7)',
        'accent-blue': '#4a9eff',
        'accent-purple': '#9b59b6',
        'ninja-dark': '#1a1a2e',
        'ninja-mid': '#16213e',
        'ninja-blue': '#0f3460',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '12px',
        lg: '16px',
      },
    },
  },
  plugins: [],
}
