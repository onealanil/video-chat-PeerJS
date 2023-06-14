/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        orange: "#3b5998 ",
      },
    },
    fontFamily: {
      poppins: ["Poppins", "sans-serif"],
      opensans: ["Open Sans", "sans-serif"],
    },
  },
  plugins: [],
};
