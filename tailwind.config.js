/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        lagon: {
          light: '#BFEFF2',
          bg: '#F2FCFC',
          border: '#DCECEF',
        },
        action: {
          DEFAULT: '#087E8B',
          hover: '#06636E',
          light: '#E6F6F7',
        },
        deep: {
          DEFAULT: '#073B4C',
          muted: '#0D536B',
        },
        sand: {
          light: '#FFF7E8',
          border: '#F7E7CD',
        },
        coral: {
          DEFAULT: '#FF8066',
          hover: '#FA6D50',
          soft: '#FFF0ED',
        },
        ink: {
          DEFAULT: '#17343D',
          muted: '#6E858A',
          subtle: '#9BB1B6',
        },
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '28px',
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(7, 59, 76, 0.05)',
        'card': '0 10px 30px -4px rgba(7, 59, 76, 0.07)',
        'modal': '0 25px 50px -12px rgba(7, 59, 76, 0.25)',
      },
    },
  },
  plugins: [],
};
