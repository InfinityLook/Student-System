/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Zapíná tmavý režim pomocí třídy
  theme: {
    extend: {
      colors: {
        studypilot: {
          bg: '#090a0f',        // Hluboké noční pozadí
          surface: '#13151f',   // Barva karet a panelů
          card: '#1a1d2d',      // Světlejší karta pro glassmorphism
          border: '#2a2f45',    // Jemné ohraničení
          primary: '#8b5cf6',   // Elektrická fialová (Levely, XP)
          accent: '#06b6d4',    // Cyberpunková azurová
          success: '#10b981',   // Mátová zelená (Streak, úkoly)
          gold: '#f59e0b',      // Coiny / odměny
        }
      },
      boxShadow: {
        'neon-purple': '0 0 20px rgba(139, 92, 246, 0.3)',
        'neon-cyan': '0 0 20px rgba(6, 182, 212, 0.3)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
