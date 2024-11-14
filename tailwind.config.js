/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // blue-500
          light: '#60A5FA',   // blue-400
          dark: '#2563EB',    // blue-600
        },
        secondary: {
          DEFAULT: '#8B5CF6',  // purple-500
          light: '#A78BFA',    // purple-400
          dark: '#7C3AED',     // purple-600
        },
        success: {
          DEFAULT: '#10B981',  // green-500
          light: '#34D399',    // green-400
          dark: '#059669',     // green-600
        },
        danger: {
          DEFAULT: '#EF4444',  // red-500
          light: '#F87171',    // red-400
          dark: '#DC2626',     // red-600
        },
        neutral: {
          text: '#1F2937',     // gray-800
          body: '#4B5563',     // gray-600
          light: '#F3F4F6',    // gray-100
          lighter: '#F9FAFB',  // gray-50
        }
      },
    },
  },
  plugins: [],
}