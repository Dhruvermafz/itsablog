import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Footer from "./components/Common/Footer";
import Router from "./router";
import { useGetProfileQuery } from "./api/userApi"; // Import the hook
import Sidebar from "./components/Common/Sidebar";

function App() {
  const location = useLocation();
  const [isPreloaderVisible, setIsPreloaderVisible] = useState(true);

  // Define auth pages where Header, Search, and Footer should be hidden
  const authPages = ["/login", "/signup"];
  const isAuthPage = authPages.includes(location.pathname);

  // Get authentication state from localStorage
  const user = localStorage.getItem("user");
  const userId = user?.userId;
  const token = user?.token;
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
      {/* Preloader */}
      {isPreloaderVisible && (
        <div class="app-preloader fixed z-50 grid h-full w-full place-content-center bg-slate-50 dark:bg-navy-900">
          <div class="app-preloader-inner relative inline-block size-48"></div>
        </div>
      )}
      <div
        id="root"
        class="min-h-100vh flex grow bg-slate-50 dark:bg-navy-900"
        x-cloak
      >
        {/* Conditionally render Header and Search */}

        {!isAuthPage && <Sidebar />}
        {/* Main content */}
        <main class="main-content w-full px-[var(--margin-x)] pb-8">
          <Router />
        </main>

        <div className="dark-mark"></div>
      </div>
      {/* Conditionally render Footer */}
      {!isAuthPage && <Footer />}
    </>
  );
}

export default App;
