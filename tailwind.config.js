/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        odyssey: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F06536',
          600: '#E05325',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          bg: '#FAF8F5',
          card: '#FFFFFF',
          dark: '#111827',
          muted: '#6B7280',
          border: '#E5E7EB',
          link: '#0284C7',
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'btn': '0 4px 14px 0 rgba(240, 101, 54, 0.25)',
      }
    },
  },
  plugins: [],
}

