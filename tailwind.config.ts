import type { Config } from "tailwindcss";
const plugin = require("tailwindcss/plugin");
const { colors } = require("./src/constants/colors");

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary6: colors.primary6,
        characterPrimary85: colors.characterPrimary85,
        neutral4: colors.neutral4,
        neutral8: colors.neutral8,
        neutral9: colors.neutral9,
        sdark1: colors.sdark1,
        sdark2: colors.sdark2,
        sdark3: colors.sdark3,
        sdark4: colors.sdark4,
        sdark5: colors.sdark5,
        neutral7: colors.neutral7,
        neutral10: colors.neutral10,
        green2: colors.green2,
        ssuccess: colors.ssuccess,
        sdanger: colors.sdanger,
        sprocessing: colors.sprocessing,
        swarning: colors.swarning,
      },
      backgroundImage: {
        login_bg: "url('/images/logo_utt_bg.jpg')",
        auth_form:
          "linear-gradient(162deg, rgba(255, 255, 255, 0.60) 0%, rgba(255, 255, 255, 0.80) 99.12%)",
      },
    },
  },
  plugins: [
    plugin(function ({ addUtilities }: any) {
      const newUtilities = {
        ".s1-heading": {
          fontFamily: "Averta Std CY, sans-serif",
          fontSize: "38px",
          lineHeight: "55px",
          fontWeight: 600,
        },
        ".s2-heading": {
          fontFamily: "Averta Std CY, sans-serif",
          fontSize: "30px",
          lineHeight: "44px",
          fontWeight: 600,
        },
        ".s3-semibold": {
          fontFamily: "Averta Std CY, sans-serif",
          fontSize: "24px",
          lineHeight: "32px",
          fontWeight: 600,
        },
        ".s4-semibold": {
          fontFamily: "Averta Std CY, sans-serif",
          fontSize: "20px",
          lineHeight: "28px",
          fontWeight: 600,
        },
        ".s5-semibold": {
          fontFamily: "Averta Std CY, sans-serif",
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: 600,
        },
        ".s5-regular": {
          fontFamily: "Averta Std CY, sans-serif",
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: 400,
        },
        ".s5-medium": {
          fontFamily: "Averta Std CY, sans-serif",
          fontSize: "16px",
          lineHeight: "24px",
          fontWeight: 500,
        },
        ".sbody-semibold": {
          fontFamily: "Averta Std CY, sans-serif",
          fontSize: "14px",
          lineHeight: "22px",
          fontWeight: 600,
        },
        ".sbody-code": {
          fontFamily: "Averta Std CY, sans-serif",
          fontSize: "14px",
          lineHeight: "22px",
          fontWeight: 400,
        },
        ".sdescription-small": {
          fontFamily: "Averta Std CY, sans-serif",
          fontSize: "12px",
          lineHeight: "16px",
          fontWeight: 400,
        },
        ".sdescription-semibold": {
          fontFamily: "Averta Std CY, sans-serif",
          fontSize: "12px",
          lineHeight: "16px",
          fontWeight: 600,
        },
      };
      addUtilities(newUtilities);
    }),
  ],
};
export default config;
