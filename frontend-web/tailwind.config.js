/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // 🔥 এই লাইনটি অবশ্যই যোগ করুন
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}