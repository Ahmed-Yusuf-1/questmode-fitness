/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'primary-bg': '#1a1a2e',
        'secondary-bg': '#16213e',
        'tertiary-bg': '#0f3460',
        'accent': '#e94560',
        'text-primary': '#ffffff',
        'text-secondary': '#a8a8b3',
        'border-color': '#3a3a5a',
        'danger': '#ff6b6b',
      },
    },
  },
  plugins: [],
}
