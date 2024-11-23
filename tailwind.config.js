/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // Indigo
          light: '#818CF8',   
          dark: '#3730A3',    
        },
        secondary: {
          DEFAULT: '#06B6D4',  // Cyan
          light: '#67E8F9',    
          dark: '#0891B2',     
        },
        accent: {
          DEFAULT: '#FB923C',  // Orange
          light: '#FDBA74',
          dark: '#EA580C',
        },
        neutral: {
          text: '#1A1A1A',     
          body: '#4B5563',     
          light: '#F3F4F6',    
          lighter: '#F9FAFB',  
        }
      },
    },
  },
  plugins: [],
}