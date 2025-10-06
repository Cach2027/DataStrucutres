import type { Config } from "tailwindcss"

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pistachio: "#D1DDDB",
        turquoise: "#85B8CB",
        cerulean: "#1D6A96",
        spruce: "#283B42",
      },
    },
  },
  plugins: [],
} satisfies Config
