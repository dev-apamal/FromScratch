/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        pomegranate: {
          50: "#fef4f2",
          100: "#ffe6e1",
          200: "#ffd1c8",
          300: "#ffb1a2",
          400: "#fc836d",
          500: "#f45335",
          600: "#e23e20",
          700: "#be3117",
          800: "#9d2c17",
          900: "#822a1a",
          950: "#471208",
        },
      },
    },
  },
  plugins: [],
};
