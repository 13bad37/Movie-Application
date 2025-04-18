module.exports = {
  // Paths to all template files
  content: ["./src/**/*.{js,jsx}"],

  theme: {
    extend: {
      // 1) Set Inter as the default sans‑serif
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },

      // 2) Your custom keyframes
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)",      opacity: "1" },
        },
      },

      // 3) ustom animation utilities
      animation: {
        fadeIn:  "fadeIn 0.8s ease-out forwards",
        slideUp: "slideUp 0.8s ease-out forwards",
      },
    },
  },

  plugins: [],
};
