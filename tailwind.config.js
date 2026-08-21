/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#F4F7F8',
        surface: '#FFFFFF',
        ink: '#14212B',
        muted: '#667784',
        line: '#DCE5E8',
        brand: {
          DEFAULT: '#0F766E',
          pressed: '#0B5F59',
          tint: '#E6F4F2',
        },
        medical: {
          DEFAULT: '#2563A6',
          tint: '#EAF2FB',
        },
        success: {
          DEFAULT: '#15805D',
          tint: '#E8F6EF',
        },
        warning: {
          DEFAULT: '#B66A08',
          tint: '#FFF3DC',
        },
        danger: {
          DEFAULT: '#C2413D',
          tint: '#FDECEC',
        },
      },
      fontFamily: {
        sans: ['Tajawal', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        tactile: '0 8px 28px rgba(20, 33, 43, 0.06)',
        floating: '0 18px 48px rgba(20, 33, 43, 0.14)',
      },
    },
  },
  plugins: [],
};
