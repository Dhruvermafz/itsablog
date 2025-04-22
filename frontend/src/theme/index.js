// Converted Ant Design theme configuration from MUI structure
// Assumes use with ConfigProvider and custom styles for components

import { theme } from "antd";
import {
  primary,
  secondary,
  error,
  warning,
  success,
  info,
} from "./themeColors";

const { defaultAlgorithm, darkAlgorithm } = theme;

const THEMES = {
  LIGHT: "light",
  DARK: "dark",
};

export const baseThemeConfig = {
  token: {
    colorPrimary: primary.main,
    colorSuccess: success.main,
    colorWarning: warning.main,
    colorError: error.main,
    colorInfo: info.main,
    fontFamily: "Poppins, sans-serif",
    fontSize: 14,
    borderRadius: 4,
  },
  components: {
    Button: {
      controlHeight: 40,
      paddingBlock: 8,
      paddingInline: 16,
      borderRadius: 4,
    },
    Card: {
      borderRadius: 8,
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      border: "1px solid #E5EAF2",
    },
    Tabs: {
      itemActiveColor: primary.main,
      titleFontSize: 12,
      titleFontWeight: 600,
    },
    Input: {
      colorTextPlaceholder: secondary[400],
    },
    Typography: {
      titleMarginBottom: 16,
      titleFontWeightStrong: 600,
      fontFamily: "Poppins, sans-serif",
    },
  },
};

export const themeModes = {
  [THEMES.LIGHT]: {
    algorithm: defaultAlgorithm,
    token: {
      colorBgBase: "#f3f4f9",
      colorText: secondary[500],
      colorTextSecondary: secondary[300],
    },
  },
  [THEMES.DARK]: {
    algorithm: darkAlgorithm,
    token: {
      colorBgBase: "#1f1f1f",
      colorText: "#ffffffd9",
      colorTextSecondary: "#ffffffa6",
    },
  },
};
