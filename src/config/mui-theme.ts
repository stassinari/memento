import { createMuiTheme, Theme } from "@material-ui/core/styles";
import deepOrange from "@material-ui/core/colors/deepOrange";
import orange from "@material-ui/core/colors/orange";
import blueGrey from "@material-ui/core/colors/blueGrey";

export type ThemePreference = "light" | "dark" | "auto";

declare module "@material-ui/core/styles/createMuiTheme" {
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
  interface ThemeOptions {
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

const buildTheme = (themeType: "light" | "dark"): Theme =>
  createMuiTheme({
    overrides: {
      MuiAppBar: {
        colorPrimary: {
          color: "#ffffff",
          backgroundColor: themeType === "light" ? deepOrange[900] : "#333333",
        },
      },
    },
    palette: {
      type: themeType,
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
  });

export default buildTheme;
