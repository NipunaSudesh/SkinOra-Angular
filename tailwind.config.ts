/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./src/app/**/*.{html,ts}",
    "./node_modules/swiper/**/*.{js,ts,css,html}",
    "./src/component/**/*.{html,ts}",  // your theme/typography is here
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000080",
        secondary: "#FFD700",
        accent: "#F8FAFC",
      },
      screens: {
        xs: "360px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      maxWidth: {
        "8xl": "90rem",
        "9xl": "100rem",   // 1600px
        "10xl": "120rem",  // 1920px
        "11xl": "140rem",  // 2240px
      },
    },
  },
  plugins: [],
}