/** @type {import('tailwindcss').Config} */

const plugin = require("tailwindcss/plugin");

module.exports = {
  content: [],
  theme: {
    colors: {
      background: "#212B46",
      "header-background": "#313B56",
      white: "#FFF",
      black: "#000",
      grey: "#8F9BB3",
      "primary-100": "#C9FCE7",
      "primary-200": "#95F9D8",
      "primary-300": "#5FEECC",
      "primary-400": "#37DEC5",
      "primary-500": "#00C9BD",
      "primary-600": "#00A7AC",
      "primary-700": "#007F90",
      "primary-800": "#005C74",
      "primary-900": "#004360",
      "success-100": "#E2FCD9",
      "success-200": "#C0FAB5",
      "success-300": "#94F18D",
      "success-400": "#6DE470",
      "success-500": "#41D352",
      "success-600": "#2FB54B",
      "success-700": "#209744",
      "success-800": "#147A3C",
      "success-900": "#0C6537",
      "info-100": "#D0EBFE",
      "info-200": "#A2D4FE",
      "info-300": "#74B9FE",
      "info-400": "#52A0FD",
      "info-500": "#1977FC",
      "info-600": "#125CD8",
      "info-700": "#0C44B5",
      "info-800": "#072F92",
      "info-900": "#042178",
      "warning-100": "#FFFDCE",
      "warning-200": "#FFFA9C",
      "warning-300": "#FFF66C",
      "warning-400": "#FFF347",
      "warning-500": "#FFEE0A",
      "warning-600": "#DBCB07",
      "warning-700": "#B7A805",
      "warning-800": "#938603",
      "warning-900": "#7A6E01",
      "danger-100": "#FFE4D9",
      "danger-200": "#FFC4B4",
      "danger-300": "#FF9C8E",
      "danger-400": "#FF7772",
      "danger-500": "#FF444E",
      "danger-600": "#DB3149",
      "danger-700": "#B72244",
      "danger-800": "#93153E",
      "danger-900": "#7A0D39",
      basic: {
        600: "#8F9BB3",
      },
    },
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        // Global classes
        ".title": `mb-5 mt-4 text-3xl font-bold text-white`,
        ".input": `border border-primary-400 rounded-1 bg-black/15 px-4 py-3 text-white`,
      });
    }),
  ],
};
