/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],  theme: {
    extend: { 
      fontFamily:{
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      dropShadow: {
        '3xl': '0 35px 35px rgba(0, 0, 0, 0.25)',
        '4xl': [
            '0 35px 35px rgba(0, 0, 0, 0.25)',
            '0 45px 65px rgba(0, 0, 0, 0.15)'
        ],
        'default' : '0 4px 4px rgba(0, 0, 0, 0.25)'
      },
      backgroundImage: {
        'hero-pattern': "url('../public/background.png')"
      },
      colors: {
        'primary-green': '#3B733E',
        'secondary-green': '#2E532F',
        'tertiary-green': '#3a683b87',
        'primary-gray': '#2E2E2E',
        'secondary-gray': '#252525',
        'tertairy-gray': '#373737',
        'quarternairy-gray': '#919191',
        'primary-grey': '#494949',
        'secondary-grey': '#424242',
        'primary-blue': '#244872',
        'secondary-blue': '#1E3C60',
        'primary-yellow': '#726524',
        'secondary-yellow': '#524919'
      },
      animation: {
        'ease-in-custom': 'ease-in 1s infinite',
        'ease-out-custom': 'ease-out 1s infinite'
      },

    },

      
  },
  plugins: [],
}

