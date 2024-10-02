import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

import { responsiveTextPlugin } from "./src/utils/plugins/responsiveTextPlugin";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layout/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    text: {
      default: {
        DEFAULT: {
          fontWeight: "400",
          fontSize: "12px",
          lineHeight: "18px",
        },
        xs: {
          fontSize: "12px",
        },
        sm: {
          fontSize: "13px",
        },
        md: {
          fontSize: "14px",
        },
      },
      xs: {
        DEFAULT: {
          fontSize: "0.75rem",
          lineHeight: "1rem",
        },
      },
      sm: {
        DEFAULT: {
          fontSize: "0.875rem",
          lineHeight: "1.25rem",
        },
      },
      base: {
        DEFAULT: {
          fontSize: "1rem",
          lineHeight: "1.5rem",
        },
      },
      lg: {
        DEFAULT: {
          fontSize: "1.125rem",
          lineHeight: "1.75rem",
        },
      },
      xl: {
        DEFAULT: {
          fontSize: "1.25rem",
          lineHeight: "1.75rem",
        },
      },
      "2xl": {
        DEFAULT: {
          fontSize: "1.5rem",
          lineHeight: "2rem",
        },
      },
      "3xl": {
        DEFAULT: {
          fontSize: "1.875rem",
          lineHeight: "2.25rem",
        },
      },
      "4xl": {
        DEFAULT: {
          fontSize: "2.25rem",
          lineHeight: "2.5rem",
        },
      },
      "5xl": {
        DEFAULT: {
          fontSize: "3rem",
          lineHeight: "3rem",
        },
      },
      "6xl": {
        DEFAULT: {
          fontSize: "3.75rem",
          lineHeight: "3.75rem",
        },
      },
      "7xl": {
        DEFAULT: {
          fontSize: "4.5rem",
          lineHeight: "4.5rem",
        },
      },
      "8xl": {
        DEFAULT: {
          fontSize: "6rem",
          lineHeight: "6rem",
        },
      },
      "9xl": {
        DEFAULT: {
          fontSize: "8rem",
          lineHeight: "8rem",
        },
      },
    },
    extend: {
      boxShadow: {
        primary: "0px 2px 0px 0px rgba(255, 255, 255, 0.15) inset",
        "primary-hover": "0px 2px 0px 0px rgba(255, 255, 255, 0.15) inset",
        "primary-focus":
          "0px 0px 0px 2px rgba(99, 102, 241, 1), 0px 0px 0px 4px rgba(255, 255, 255, 1) inset",
        "primary-disabled": "0px 2px 0px 0px rgba(255, 255, 255, 0.15) inset",
        outline: "0px 1px 2px 0px rgba(0, 0, 0, 0.05)",
        "outline-focus": `
          0px 0px 0px 4px rgba(99, 102, 241, 1), 
          0px 0px 0px 2px rgba(255, 255, 255, 1), 
          0px 1px 2px 0px rgba(0, 0, 0, 0.05)
        `,
      },

      backgroundImage: {
        "gradient-outline": `
          linear-gradient(0deg, #FFFFFF, #FFFFFF), 
          linear-gradient(0deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02))
        `,
        "gradient-plain": `
          linear-gradient(0deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.15)),
          linear-gradient(0deg, rgba(0, 0, 0, 0.02), rgba(0, 0, 0, 0.02))
        `,
      },
      colors: {
        red: {
          5: "#EF4444"
        },
        grey: {
          5: "#D1D5DB",
          15: "#9CA3AF",
          25: "#71717A",
        },
        purple: {
          5: "#6B73DF",
          15: "#515AD9",
        },
        navy: {
          5: "#374061",
          15: "#272E48",
          25: "#1F263D",
        },
      },
      borderRadius: {
        lg: "12px",
        md: "8px",
        sm: "6px",
      },
      fontFamily: {
        inter: "var(--font-inter)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    responsiveTextPlugin({
      extraFonts: [{ name: "serif", multiplicator: 1.08 }],
    }),
    plugin(({ addComponents, addUtilities }: any) => {
      addComponents({
        ".flex-wrapper-center": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
        },
        ".flex-wrapper-column": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        },
      });
      addUtilities({
        ".scrollbar-hide": {
          /* IE and Edge */
          "-ms-overflow-style": "none",
          /* Firefox */
          "scrollbar-width": "none",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
        ".horizontal-tb": {
          writingMode: "horizontal-tb",
        },
        ".vertical-rl": {
          writingMode: "vertical-rl",
        },
        ".vertical-lr": {
          writingMode: "vertical-lr",
        },
        ".scrollbar-default": {
          /* IE and Edge */
          "-ms-overflow-style": "auto",
          /* Firefox */
          "scrollbar-width": "auto",
          /* Safari and Chrome */
          "&::-webkit-scrollbar": {
            display: "block",
          },
        },
      });
    }),
  ],
};
export default config;
