/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        incognito: ["var(--incognito)"],
        inter: ["var(--inter)"],
      },
      colors: {
        "primary-color": "#33E092",
        "secondary-color": "#0CCE6B",
        "tertiary-color": "#16a34a",
        "primary-bg": "rgba(39, 39, 43, 0.4)",
        "secondary-bg": "rgba(250, 250, 250, 0.4)",
      },
      boxShadow: {
        "line-light": "rgba(17, 17, 26, 0.1) 0px 1px 0px",
        "line-dark": "rgb(29, 29, 32) 0px 1px 0px",
      },
      gridTemplateColumns: {
        custom: "1.2fr 1fr",
      },
      gridTemplateRows: {
        fit: "min-content 0fr",
        full: "min-content 1fr",
      },
      backgroundImage: {
        noise:
          "url('/images/noise.png')",
      },
      backgroundPosition: {
        zero: "0 0",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "drive-by": {
          "0%": { transform: "translateX(0)", opacity: "1" },
          "40%": { transform: "translateX(80px)", opacity: "1" },
          "41%": { transform: "translateX(80px)", opacity: "0" },
          "59%": { transform: "translateX(-80px)", opacity: "0" },
          "60%": { transform: "translateX(-80px)", opacity: "1" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "smoke": {
          "0%": { transform: "scale(0.2) translate(0, 0) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "0.8" },
          "100%": { transform: "scale(3) translate(-15px, -8px) rotate(45deg)", opacity: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(15px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        }
      },
      animation: {
        marquee: "marquee 25s linear infinite",
        "marquee-reverse": "marquee-reverse 25s linear infinite",
        "drive-by": "drive-by 0.5s linear",
        "smoke": "smoke 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
