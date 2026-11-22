/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern editorial food brand palette
        forest: {
          DEFAULT: '#14612A',
          deep: '#0B3D1A',
        },
        primary: {
          DEFAULT: '#14612A',
          dark: '#0B3D1A',
          hover: '#0E4E20',
          light: '#237D3D',
        },
        leaf: '#4FA52A',
        lime: {
          DEFAULT: '#A6CE39',
          light: '#C3E368',
          dark: '#85A827',
        },
        red: {
          DEFAULT: '#D62828',
          hover: '#B52222',
          light: '#FCEBEB',
        },
        'brand-red': {
          DEFAULT: '#D62828',
          hover: '#B52222',
          light: '#FCEBEB',
        },
        marigold: {
          DEFAULT: '#F5A524',
          light: '#FEF6E9',
          dark: '#D98207',
        },
        cream: {
          DEFAULT: '#FAFAF3',
          dark: '#F3F3E8',
          soft: '#FDFCFA',
        },
        mint: {
          DEFAULT: '#EAF4E4',
          dark: '#D5E9CC',
          light: '#F4F9F0',
        },
        ink: '#1F2A22',
        surface: '#FFFFFF',
        'app-text': '#1F2A22',
        muted: '#6B7A6F',
        'muted-light': '#98A69C',
        line: '#DDE6D6',
        border: '#DDE6D6',
        success: '#2E9E4F',
        error: '#D62828',
      },
      fontFamily: {
        heading: ['Fraunces', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
        hindi: ['Noto Sans Devanagari', 'Tiro Devanagari Hindi', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.02em',
        eyebrow: '0.12em',
      },
      borderRadius: {
        'btn': '10px',
        'input': '10px',
        'card': '12px',
        'card-lg': '16px',
      },
      boxShadow: {
        'soft': '0 6px 20px rgba(11, 61, 26, 0.08)',
        'hover': '0 6px 20px rgba(11, 61, 26, 0.08)',
        'green-soft': '0 6px 20px rgba(11, 61, 26, 0.08)',
        'green-md': '0 6px 20px rgba(11, 61, 26, 0.08)',
        'green-lg': '0 6px 20px rgba(11, 61, 26, 0.08)',
        'floating': '0 6px 20px rgba(11, 61, 26, 0.08)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        marqueeReverse: {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
        'marquee-fast': 'marquee 22s linear infinite',
        'marquee-slow': 'marquee 50s linear infinite',
        'marquee-reverse': 'marqueeReverse 35s linear infinite',
        'marquee-reverse-fast': 'marqueeReverse 22s linear infinite',
      },
    },
  },
  plugins: [],
}
