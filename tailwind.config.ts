// tailwind.config.js   (in project root, next to angular.json)

import type { Config } from 'tailwindcss'

export default {
  content: [
    "./src/**/*.{html,ts}",           // scans all Angular templates & components
    // Add more if you have libs, stories, etc.
    // "./projects/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000080",     // navy blue
        secondary: "#FFD700",   // gold
        accent: "#F8FAFC",      // very light gray
      },
      screens: {
        xs: "360px",     // small phones
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      maxWidth: {
        "8xl": "90rem",    // 1440px
        "9xl": "100rem",   // 1600px
        "10xl": "120rem",  // 1920px
        "11xl": "140rem",  // 2240px
      },
    },
  },
  plugins: [],
} satisfies Config