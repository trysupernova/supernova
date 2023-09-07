/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        slideIn: {
          from: {
            opacity: 0,
            transform: "translateY(10%)"
          },
          to: {
            opacity: 1,
            transform: "translateY(0)"
          },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'dark-teal-gradient': 'linear-gradient(180deg, #000 17.19%, #0A3631 100%)',
      },
      animation: {
        slideIn: "slideIn 1.5s ease-in",
      }
    },
  },
  plugins: [],
}
