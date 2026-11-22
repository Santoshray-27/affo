/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#14612A',
          deep: '#0B3D1A',
        },
        'forest-deep': '#0B3D1A',
        primary: {
          DEFAULT: '#14612A',
          dark: '#0B3D1A',
          hover: '#0E4E20',
        },
        leaf: '#4FA52A',
        lime: '#A6CE39',
        red: {
          DEFAULT: '#D62828',
          dark: '#B01F1F',
          hover: '#B01F1F',
          light: '#FCEBEB',
        },
        'red-dark': '#B01F1F',
        'brand-red': '#D62828',
        'red-brand': '#D62828',
        marigold: '#8A5A00',
        cream: '#FAFAF3',
        mint: '#EAF4E4',
        white: '#FFFFFF',
        ink: '#1F2A22',
        surface: '#FFFFFF',
        'app-text': '#1F2A22',
        muted: '#5B6A5F',
        line: '#DDE6D6',
        border: '#DDE6D6',
        'on-dark': '#FAFAF3',
        'on-dark-muted': '#C9D8C6',
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
        'dropdown': '0 10px 30px rgba(11, 61, 26, 0.1)',
        'floating': '0 12px 36px rgba(11, 61, 26, 0.12)',
      },
    },
  },
  plugins: [],
}
