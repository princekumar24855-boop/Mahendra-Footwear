/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FDF8F3',
          100: '#F7EDE2',
          200: '#EBD4BC',
          300: '#DCB58E',
          400: '#C9905C',
          500: '#B46C31',
          600: '#9A3412', // Rich cognac/leather
          700: '#7C2D12',
          800: '#64240F',
          900: '#431407',
          950: '#260B04',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          muted: '#F8F7F4',
          subtle: '#EFECE6',
        },
        whatsapp: {
          DEFAULT: '#25D366',
          dark: '#128C7E',
          hover: '#20BA5A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.06)',
        'elevated': '0 10px 30px -5px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}
