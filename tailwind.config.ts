import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

import { responsiveTextPlugin } from "./src/utils/plugins/responsiveTextPlugin";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
    },
    extend: {
      colors: {
        primary: "#F57906",
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
