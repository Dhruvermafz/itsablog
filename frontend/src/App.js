import { useState, useEffect } from "react";
import { ConfigProvider, theme as antdTheme } from "antd";
import { initiateSocketConnection } from "./helpers/socketHelper";
import Router from "./router";
import Footer from "./components/Home/Footer";
import "antd/dist/reset.css"; // New in antd v5
import "./index.css"; // Your global styles

function App() {
  const [darkmode, setDarkMode] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  // INITIATE SOCKET CONNECTION
  useEffect(() => {
    initiateSocketConnection();
  }, []);

  // DARK MODE DETECTION
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

    // Dynamically set background color for dark/light mode
    document.body.style.backgroundColor = darkmode ? "#1f1f1f" : "#f0f2f5";
  }, [darkmode]);

  // ONLINE/OFFLINE EVENTS
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
    <ConfigProvider
      theme={{
        algorithm: darkmode
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: darkmode ? "#1677ff" : "#1890ff", // Primary color can change
        },
      }}
    >
      <Router />
      {/* <Footer /> Uncomment if using */}
    </ConfigProvider>
  );
}

export default App;
