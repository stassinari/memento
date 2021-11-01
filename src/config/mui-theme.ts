import { createTheme, Theme, adaptV4Theme } from "@mui/material/styles";
import { deepOrange, orange, blueGrey } from '@mui/material/colors';

export type ThemePreference = "light" | "dark" | "auto";

declare module "@mui/material/styles/createMuiTheme" {
  interface Theme {
    gradient: {
      bgImage: string;
      start: number[];
      end: number[];
    };
    isDark: boolean;
    appBarHeight: {
      default: number;
      sm: number;
      md: number;
    };
  }
  // allow configuration using `createMuiTheme`
  interface DeprecatedThemeOptions {
    gradient?: {
      bgImage?: string;
      start?: number[];
      end?: number[];
    };
    isDark?: boolean;
    appBarHeight?: {
      default: number;
      sm: number;
      md: number;
    };
  }
}

const gradientStart = [179, 123, 60];
const gradientEnd = [37, 33, 29];
const dzLight =
  "repeating-linear-gradient(-45deg, #fff, #fff 25px, rgba(0, 0, 0, 0.12) 25px, rgba(0, 0, 0, 0.12) 50px)";
const dzDark =
  "repeating-linear-gradient(-45deg, #424242, #424242 25px, rgba(255, 255, 255, 0.12) 25px, rgba(255, 255, 255, 0.12) 50px)";

const buildTheme = (themeType: "light" | "dark"): Theme =>
  createTheme(adaptV4Theme({
    overrides: {
      MuiAppBar: {
        colorPrimary: {
          color: "#ffffff",
          backgroundColor: themeType === "light" ? deepOrange[900] : "#333333",
        },
      },
      // @ts-ignore
      MuiDropzoneArea: {
        invalid: {
          backgroundImage: themeType === "light" ? dzLight : dzDark,
          borderColor: "#ffccbc",
        },
      },
    },
    palette: {
      mode: themeType,
      primary: {
        main: themeType === "light" ? deepOrange[900] : orange[500],
        light: deepOrange[100],
      },
      secondary: {
        main: blueGrey[500],
      },
    },
    gradient: {
      bgImage: `linear-gradient(90deg, rgba(${gradientStart[0]},${gradientStart[1]},${gradientStart[2]},1) 0%, rgba(${gradientEnd[0]},${gradientEnd[1]},${gradientEnd[2]},1) 100%)`,
      start: gradientStart,
      end: gradientEnd,
    },
    isDark: themeType === "dark",
    appBarHeight: {
      default: 56,
      sm: 64,
      md: 96,
    },
  }));

export default buildTheme;
