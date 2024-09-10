import plugin from "tailwindcss/plugin";
import { CSSRuleObject } from "tailwindcss/types/config";
type ExtraFonts = {
  name: string;
  multiplicator: number;
};

type ResponsiveText = {
  extraFonts: ExtraFonts[];
};

type FontSizeConfig = {
  fontSize: string;
  lineHeight: string;
  letterSpacing?: string;
  fontWeight?: string;
};

type FontThemeConfig = {
  DEFAULT: FontSizeConfig;
  [screenSize: string]: FontSizeConfig;
};

const parsePx = (px: string): number => {
  return Number(px.slice(0, -3));
};

const pxToRem = (px: number): string => {
  return `${px}rem`;
};

export const responsiveTextPlugin = ({ extraFonts }: ResponsiveText) =>
  plugin(({ theme, addComponents }) => {
    const textTheme = (theme("text") as Record<string, FontThemeConfig>) || {};
    const screens = (theme("screens") as Record<string, string>) || {};

    const createStyles = (
      config: FontThemeConfig,
      extraFont?: ExtraFonts
    ): CSSRuleObject => {
      const multiplicator = extraFont?.multiplicator || 1;

      const styles: CSSRuleObject = {
        fontSize: pxToRem(parsePx(config.DEFAULT.fontSize) * multiplicator),
        lineHeight: config.DEFAULT.lineHeight,
        letterSpacing: config.DEFAULT.letterSpacing || "normal",
        fontWeight: config.DEFAULT.fontWeight || "normal",
      };

      Object.keys(screens).forEach((key) => {
        if (config[key]) {
          styles[`@media (min-width: ${screens[key]})`] = {
            fontSize: pxToRem(parsePx(config[key].fontSize) * multiplicator),
            lineHeight: config[key].lineHeight,
            letterSpacing: config[key].letterSpacing || "normal",
            fontWeight: config[key].fontWeight || "normal",
          };
        }
      });

      return styles;
    };

    const components: Record<string, CSSRuleObject> = Object.keys(
      textTheme
    ).reduce<Record<string, CSSRuleObject>>((all, key) => {
      const config = textTheme[key];
      all[`.text-${key}`] = createStyles(config);

      extraFonts?.forEach((extraFont) => {
        all[`.text-${key}-${extraFont.name}`] = createStyles(config, extraFont);
      });

      return all;
    }, {});

    // Wrapping components in an array to match the expected type
    addComponents([components]);
  });
