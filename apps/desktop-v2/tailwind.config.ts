import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "dark-teal-gradient":
          "linear-gradient(180deg, #000 17.19%, #0A3631 100%)",
      },
      keyframes: {
        slideInFromTop: {
          from: {
            opacity: "0",
            transform: "translateY(-20%)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        slideInFromBottom: {
          from: {
            opacity: "0",
            transform: "translateY(10%)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        overlayShow: {
          from: { opacity: "0" },
          to: { opacity: "0.3" },
        },
        contentShow: {
          from: {
            opacity: "0",
            transform: "translate(-50%, -48%) scale(0.96)",
          },
          to: { opacity: "1", transform: "translate(-50%, -50%) scale(1)" },
        },
      },
      animation: {
        overlayShow: "overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        contentShow: "contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)",
        slideInFromBottomSlow: "slideInFromBottom 1.5s ease-in",
        slideInFromTopFast: "slideInFromTop 0.4s ease-in",
      },
    },
  },
  plugins: [],
};
export default config;
