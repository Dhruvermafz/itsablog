// theme.js
import { theme } from "antd";

export const getAntdTheme = (darkmode = false) => ({
  algorithm: darkmode ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    borderRadius: 8,
    colorPrimary: "#1677ff",
    fontFamily: "'Inter', sans-serif",
    // Add other global tokens if needed
  },
  components: {
    Card: {
      borderRadius: 10,
      padding: 16,
      boxShadow: darkmode
        ? "0 1px 4px rgba(255, 255, 255, 0.05)"
        : "0 1px 4px rgba(0, 0, 0, 0.1)",
    },
    Layout: {
      headerBg: darkmode ? "#1f1f1f" : "#ffffff",
    },
  },
});
