import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, message, Tabs } from "antd";
import { SearchOutlined, MenuOutlined } from "@ant-design/icons";
import { useGetProfileQuery, useLogoutMutation } from "../../api/userApi";

const { TabPane } = Tabs;

const Header = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchVisible, setSearchVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Authentication state
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const isAuthenticated = !!userId && !!token;

  // Fetch user profile
  const {
    data: userData,
    isLoading: userLoading,
    error: userError,
  } = useGetProfileQuery(
    { userId, page: 1, pageSize: 8 },
    { skip: !isAuthenticated || !userId }
  );

  // Logout mutation
  const [logout] = useLogoutMutation();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle user error
  useEffect(() => {
    if (userError) {
      console.error("Failed to load user profile:", userError);
      if (userError?.status === 401) {
        handleLogout();
        message.error("Session expired. Please log in again.");
      }
    }
  }, [userError]);

  const isMobile = windowWidth < 500;
  const isNavbarCompact = windowWidth < 600;

  const handleSearchChange = (e) => setSearch(e.target.value);

  const handleSearchSubmit = (value) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value)}`);
      setSearch("");
      setSearchVisible(false);
    }
  };

  const toggleSearch = () => setSearchVisible(!searchVisible);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      localStorage.removeItem("userId");
      localStorage.removeItem("token");
      message.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      message.error("Failed to log out. Please try again.");
    }
  };

  return (
    <nav className="header before:bg-white dark:before:bg-navy-750 print:hidden">
      <div className="header-container relative flex w-full print:hidden">
        <div className="flex w-full items-center justify-between">
          {/* Left: Sidebar Toggle Button */}
          <div className="h-7 w-7"></div>

          {/* Right: Header buttons */}
          <div className="-mr-1.5 flex items-center space-x-2">
            {/* Mobile Search Toggle */}
            {isMobile && (
              <Button
                type="text"
                icon={<SearchOutlined />}
                className="size-8 rounded-full p-0 hover:bg-slate-300/20 focus:bg-slate-300/20 active:bg-slate-300/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                onClick={toggleSearch}
              />
            )}

            {/* Main Searchbar */}
            {!isMobile && (
              <div className="relative mr-4 flex h-8">
                <Input.Search
                  placeholder="Search here..."
                  value={search}
                  onChange={handleSearchChange}
                  onSearch={handleSearchSubmit}
                  className="form-input h-full rounded-full bg-slate-150 px-4 pl-9 text-xs-plus text-slate-800 ring-primary/50 hover:bg-slate-200 focus:ring-3 dark:bg-navy-900/90 dark:text-navy-100 dark:placeholder-navy-300 dark:ring-accent/50 dark:hover:bg-navy-900 dark:focus:bg-navy-900"
                  style={{ width: searchVisible ? 320 : 240 }}
                  prefix={
                    <SearchOutlined className="text-slate-400 peer-focus:text-primary dark:text-navy-300 dark:peer-focus:text-accent" />
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
