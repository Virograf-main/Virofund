/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust if your src folder is different
    "./app/**/*.{js,ts,jsx,tsx}", // If using app router
    "./pages/**/*.{js,ts,jsx,tsx}", // If using pages router
    "./components/**/*.{js,ts,jsx,tsx}", // For your atomic components
  ],
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}; 