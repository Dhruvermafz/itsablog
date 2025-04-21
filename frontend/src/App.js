import { useState, useEffect } from "react";
import { ConfigProvider } from "antd";
import { initiateSocketConnection } from "./helpers/socketHelper";
import Router from "./router";
// import Footer from "./components/Home/Footer"; // Optional
import Navbar from "./components/Home/Navbar";
import { getAntdTheme } from "./theme";

import "antd/dist/reset.css"; // Ant Design v5 reset
import "./index.css"; // Your global CSS styles

function App() {
  const [darkmode, setDarkMode] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  // Initialize socket
  useEffect(() => {
    initiateSocketConnection();
  }, []);

  // Detect dark mode preference and apply background color
  useEffect(() => {
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (localStorage.getItem("darkmode") === null) {
      localStorage.setItem("darkmode", prefersDark.toString());
      setDarkMode(prefersDark);
    } else {
      const isDark = localStorage.getItem("darkmode") === "true";
      setDarkMode(isDark);
    }
  }, []);

  // Update background dynamically on mode change
  useEffect(() => {
    document.body.style.backgroundColor = darkmode
      ? "var(--bg-dark)"
      : "var(--bg-color)";
  }, [darkmode]);

  // Handle online/offline status
  useEffect(() => {
    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  return (
    <ConfigProvider theme={getAntdTheme(darkmode)}>
      <Router />
      {/* <Footer /> */}
    </ConfigProvider>
  );
}

export default App;
