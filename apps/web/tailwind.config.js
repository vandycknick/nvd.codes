const config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            code: {
              color: "var(--tw-prose-pre-code)",
              backgroundColor: "var(--tw-prose-pre-bg)",
              paddingTop: "2px",
              paddingBottom: "2px",
              paddingLeft: "5px",
              paddingRight: "5px",
              borderRadius: ".25rem",
            },
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },
          },
        },
      },
      fontFamily: {
        sans: "system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Cantarell,Noto Sans,sans-serif,Helvetica,Arial,Apple Color Emoji,Segoe UI Emoji",
        mono: "SFMono-Regular,Menlo,Monaco,Consolas,'Liberation Mono','Courier New',monospace",
      },
    },
    colors: {
      nord: {
        50: "#ffffff",
        100: "#f8f9fb",
        200: "#e5e9f0",
        300: "#d8dee9",
        400: "#4c566a",
        500: "#434c5e",
        600: "#3b4252",
        700: "#2e3440",
        800: "#292e39",
        900: "#242933",
      },

      frost: {
        primary: "#8fbcbb",
        secondary: "#88c0d0",
        100: "#8fbcbb",
        200: "#88c0d0",
        300: "#81a1c1",
        400: "#5e81ac",
      },
      aurora: {
        100: "#bf616a", // red
        200: "#d08770", // orange
        300: "#ebcb8b", // yellow
        400: "#a3be8c", // green
        500: "#b48ead", // purple
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}

module.exports = config
