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
        // Custom Odyssey Theme Palette
        'odyssey-blue-poppy': '#9BB6CF',
        'odyssey-poppy': '#9BB6CF',
        'odyssey-cream': '#F3E5AB',
        'odyssey-tan': '#BFA06A',
        'odyssey-brown': '#8C5E3C',
        'odyssey-slate': '#2E4057',
        'odyssey-navy': '#1B1F3B',

        odyssey: {
          bluePoppy: '#9BB6CF',
          cream: '#F3E5AB',
          tan: '#BFA06A',
          brown: '#8C5E3C',
          slate: '#2E4057',
          navy: '#1B1F3B',
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
          dark: '#1B1F3B',
          muted: '#2E4057',
          border: '#BFA06A',
          link: '#0284C7',
        }
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02)',
        'btn': '0 4px 14px 0 rgba(140, 94, 60, 0.25)',
      }
    },
  },
  plugins: [],
}
