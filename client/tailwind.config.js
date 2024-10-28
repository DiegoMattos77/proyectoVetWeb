// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Ajusta esta ruta según la estructura de tu proyecto
  ],
  theme: {
    extend: {
      colors: {
        violetPalette: {
          light: '#E0BBE4',
          DEFAULT: '#957DAD',
          dark: '#4B0082',
          accent: '#D291BC',
          muted: '#0098da',
          headerColor: '#cbd5e1',
        },
      },
    },
  },
  plugins: [],
};