/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        "fade-in": "fade-in 0.3s ease-in-out",
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        overlayShow: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        contentShow: {
          from: {
            opacity: "0",
            transform: "translate(-50%, -48%) scale(0.96)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // Use "Manrope" as the font family
      },
      fontSize: {
        h1: "24px", // Custom h1 font size
        h2: "16px", // Custom h2 font size
        h3: "14px", // Custom h3 font size
        base: "12px", // Custom base font size (body text)
      },
      lineHeight: {
        h1: "33px", // Custom h1 line height
        h2: "22px", // Custom h2 line height
        h3: "19px", // Custom h3 line height
        base: "16px", // Custom base line height (body text)
      },
      fontWeight: {
        h1: "semibold", // Custom h1 font weight
        h2: "semibold", // Custom h2 font weight
        h3: "semibold", // Custom h3 font weight
        base: "semibold", // Custom base font weight (body text)
      },

      colors: {
        palatinateBlue: "#1e88e5",
        backgroundHover: "#1565c0",
        verifiedBlack: "#242424",
        covoloNero: "#73939E",
        breathofFreshAir: "#C7DCE4",
        blizzard: "#E6EBED",
        pureWhite: "#FFFFFF",
        border: "#C9D7DE",
        inactive: "#ACACAC",
      },

      backgroundColor: {
        btnBackground: "#1e88e5",
        btnBackgroundHover: "#1829C5",
        choiceBackground: "#EFF3F5",
      },
    },
  },
  plugins: [],
};
