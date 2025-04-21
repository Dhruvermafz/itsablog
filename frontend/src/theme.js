// theme.js
import { theme } from "antd";

export const getAntdTheme = (darkmode = false) => ({
  algorithm: darkmode ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    borderRadius: 12,
    fontFamily: "'Inter', 'Merriweather', serif",
    colorPrimary: darkmode ? "#8ecae6" : "#1677ff",
    colorBgContainer: darkmode ? "#121212" : "#f9f9f9",
    colorText: darkmode ? "#e0e0e0" : "#1a1a1a",
    colorBorder: darkmode ? "#2a2a2a" : "#dcdcdc",
  },
  components: {
    Card: {
      borderRadius: 14,
      padding: 20,
      colorBgContainer: darkmode ? "#1e1e1e" : "#ffffff",
      boxShadow: darkmode
        ? "0 4px 12px rgba(0, 0, 0, 0.4)"
        : "0 4px 16px rgba(0, 0, 0, 0.08)",
    },
    Layout: {
      headerBg: darkmode ? "#181818" : "#ffffff",
      footerBg: darkmode ? "#141414" : "#f8f8f8",
    },
    Typography: {
      colorTextHeading: darkmode ? "#fafafa" : "#111",
      fontWeightStrong: 600,
      titleMarginBottom: 12,
    },
    Button: {
      colorPrimary: darkmode ? "#90caf9" : "#1677ff",
      colorPrimaryHover: darkmode ? "#64b5f6" : "#4096ff",
      borderRadius: 10,
      fontWeight: 500,
    },
    Input: {
      colorBgContainer: darkmode ? "#1b1b1b" : "#ffffff",
      colorTextPlaceholder: darkmode ? "#aaaaaa" : "#888888",
      borderRadius: 10,
    },
  },
});
