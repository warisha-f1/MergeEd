/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        teacherBg: "#1a1a1a", // This is almost black!
      },
    },
  },
  plugins: [],
}