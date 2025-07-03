import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "./components/Common/Footer";
import Header from "./components/Common/Header";
import Search from "./components/Common/Search";
import Router from "./router";
import "./App.css";
import { useGetProfileQuery } from "./api/userApi"; // Import the hook

function App() {
  const location = useLocation();
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);

  // Define auth pages where Header, Search, and Footer should be hidden
  const authPages = ["/login", "/signup"];
  const isAuthPage = authPages.includes(location.pathname);

  // Get authentication state from localStorage
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const isAuthenticated = !!userId && !!token;

  // Fetch user profile to determine app loading state
  const { isLoading: userLoading, error: userError } = useGetProfileQuery(
    { userId, page: 1, pageSize: 8 },
    { skip: !isAuthenticated || !userId }
  );

  // Hide preloader once authentication status is resolved
  useEffect(() => {
    if (!userLoading && (userError || isAuthenticated || !isAuthenticated)) {
      // Delay hiding preloader for better UX (optional)
      const timer = setTimeout(() => {
        setIsPreloaderVisible(false);
      }, 500); // Adjust delay as needed (500ms for smooth transition)
      return () => clearTimeout(timer);
    }
  }, [userLoading, userError, isAuthenticated]);

  return (
    <>
      {/* Scroll progress bar */}
      <div className="scroll-progress primary-bg"></div>

      {/* Preloader */}
      {isPreloaderVisible && (
        <div className="preloader text-center">
          <div className="circle"></div>
        </div>
      )}

      {/* Conditionally render Header and Search */}
      {!isAuthPage && <Header />}
      {!isAuthPage && <Search />}

      {/* Main content */}
      <main className="bg-grey pt-80 pb-50">
        <Router />
      </main>

      {/* Conditionally render Footer */}
      {!isAuthPage && <Footer />}

      <div className="dark-mark"></div>
    </>
  );
}

export default App;
