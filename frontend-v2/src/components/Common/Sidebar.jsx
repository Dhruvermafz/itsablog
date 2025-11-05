import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown, Menu, Modal, Input } from "antd";
import Avatar from "react-avatar";
import { isLoggedIn } from "../../helpers/authHelper";
import logo from "../../assets/images/logo.png";

// Ant Design Icons
import {
  HomeOutlined,
  SearchOutlined,
  SettingOutlined,
  TeamOutlined,
  EditOutlined,
  UserOutlined,
  LogoutOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

const { Search } = Input;

const Sidebar = () => {
  const navigate = useNavigate();
  const currentUser = isLoggedIn();
  const [searchVisible, setSearchVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

  // -------------------------------------------------
  //  Detect screen size → switch between sidebar / bottom bar
  // -------------------------------------------------
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // -------------------------------------------------
  //  Helper – safe display name
  // -------------------------------------------------
  const displayName =
    typeof currentUser?.name === "string"
      ? currentUser.name
      : typeof currentUser?.username === "string"
      ? currentUser.username
      : "User";

  // -------------------------------------------------
  //  Dropdown menu (profile, settings, logout)
  // -------------------------------------------------
  const menu = (
    <Menu
      className="w-64 rounded-lg border border-slate-150 bg-white shadow-soft dark:border-navy-600 dark:bg-navy-700"
      items={[
        {
          key: "profile-header",
          disabled: true,
          label: (
            <div className="flex items-center space-x-4 rounded-t-lg bg-slate-100 py-5 px-4 dark:bg-navy-800">
              <div className="avatar size-14">
                <Avatar
                  name={displayName}
                  src={
                    typeof currentUser?.avatar === "string"
                      ? currentUser.avatar
                      : undefined
                  }
                  size="56"
                  round={true}
                  className="rounded-full"
                />
              </div>
              <div>
                <a
                  href={`/u/${
                    typeof currentUser?.username === "string"
                      ? currentUser.username
                      : ""
                  }`}
                  className="text-base font-medium text-slate-700 hover:text-primary focus:text-primary dark:text-navy-100 dark:hover:text-accent-light dark:focus:text-accent-light"
                >
                  {displayName}
                </a>
                <p className="text-xs text-slate-400 dark:text-navy-300">
                  {typeof currentUser?.role === "string"
                    ? currentUser.role
                    : "Product Designer"}
                </p>
              </div>
            </div>
          ),
        },
        {
          key: "profile",
          label: (
            <a
              href={`/u/${
                typeof currentUser?.username === "string"
                  ? currentUser.username
                  : ""
              }`}
              className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-none transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-warning text-white">
                <UserOutlined className="text-lg" />
              </div>
              <div>
                <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
                  Profile
                </h2>
                <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                  Your profile setting
                </div>
              </div>
            </a>
          ),
        },
        {
          key: "settings",
          label: (
            <a
              href="/settings"
              className="group flex items-center space-x-3 py-2 px-4 tracking-wide outline-none transition-all hover:bg-slate-100 focus:bg-slate-100 dark:hover:bg-navy-600 dark:focus:bg-navy-600"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-success text-white">
                <SettingOutlined className="text-lg" />
              </div>
              <div>
                <h2 className="font-medium text-slate-700 transition-colors group-hover:text-primary group-focus:text-primary dark:text-navy-100 dark:group-hover:text-accent-light dark:group-focus:text-accent-light">
                  Settings
                </h2>
                <div className="text-xs text-slate-400 line-clamp-1 dark:text-navy-300">
                  Webapp settings
                </div>
              </div>
            </a>
          ),
        },
        {
          key: "logout",
          label: (
            <div className="mt-3 px-4">
              <button
                className="btn h-9 w-full space-x-2 bg-primary text-white hover:bg-primary-focus focus:bg-primary-focus active:bg-primary-focus/90 dark:bg-accent dark:hover:bg-accent-focus dark:focus:bg-accent-focus dark:active:bg-accent/90"
                onClick={() => {
                  localStorage.removeItem("authToken");
                  navigate("/login");
                }}
              >
                <LogoutOutlined className="text-base" />
                <span>Logout</span>
              </button>
            </div>
          ),
        },
      ]}
    />
  );

  // -------------------------------------------------
  //  Common navigation items (used in both layouts)
  // -------------------------------------------------
  const navItems = [
    {
      href: "/",
      icon: <HomeOutlined className="text-2xl" />,
      tooltip: "Dashboard",
    },
    {
      href: null,
      icon: <SearchOutlined className="text-2xl" />,
      tooltip: "Search",
      onClick: () => setSearchVisible(true),
    },
    {
      href: "/settings",
      icon: <SettingOutlined className="text-2xl" />,
      tooltip: "Settings",
    },
    {
      href: "/groups",
      icon: <TeamOutlined className="text-2xl" />,
      tooltip: "Groups",
    },
    {
      href: "/create-blog",
      icon: <EditOutlined className="text-2xl" />,
      tooltip: "Create Blog",
    },
  ];

  // -------------------------------------------------
  //  Desktop Sidebar
  // -------------------------------------------------
  const DesktopSidebar = (
    <div className="sidebar print:hidden">
      <div className="main-sidebar">
        <div className="flex h-full w-full flex-col items-center border-r border-slate-150 bg-white dark:border-navy-700 dark:bg-navy-800">
          {/* Logo */}
          <div className="flex pt-4">
            <a href="/">
              <img
                className="size-11 transition-transform duration-500 ease-in-out hover:rotate-[360deg]"
                src={logo}
                alt="logo"
              />
            </a>
          </div>

          {/* Nav */}
          <div className="is-scrollbar-hidden flex grow flex-col space-y-4 overflow-y-auto pt-6">
            {navItems.map((item, idx) =>
              item.href ? (
                <a
                  key={idx}
                  href={item.href}
                  className="flex size-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  data-tooltip={item.tooltip}
                >
                  {item.icon}
                </a>
              ) : (
                <button
                  key={idx}
                  onClick={item.onClick}
                  className="flex size-11 items-center justify-center rounded-lg outline-none transition-colors duration-200 hover:bg-primary/20 focus:bg-primary/20 active:bg-primary/25 dark:hover:bg-navy-300/20 dark:focus:bg-navy-300/20 dark:active:bg-navy-300/25"
                  data-tooltip={item.tooltip}
                >
                  {item.icon}
                </button>
              )
            )}
          </div>

          {/* User avatar */}
          <div className="flex flex-col items-center space-y-3 py-3">
            <Dropdown
              overlay={menu}
              trigger={["click"]}
              placement="rightBottom"
            >
              <button
                className="avatar size-12 cursor-pointer relative"
                data-tooltip="User Profile"
              >
                <Avatar
                  name={displayName}
                  src={
                    typeof currentUser?.avatar === "string"
                      ? currentUser.avatar
                      : undefined
                  }
                  size="48"
                  round={true}
                  className="rounded-full"
                />
                <span className="absolute right-0 bottom-0 size-3.5 rounded-full border-2 border-white bg-success dark:border-navy-700"></span>
              </button>
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  );

  // -------------------------------------------------
  //  Mobile Bottom Bar
  // -------------------------------------------------
  const MobileBottomBar = (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-white border-t border-slate-150 dark:bg-navy-800 dark:border-navy-700 print:hidden">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return item.href ? (
            <a
              key={idx}
              href={item.href}
              className="flex flex-col items-center space-y-1 p-2 text-slate-600 dark:text-navy-200"
            >
              {Icon}
              <span className="text-xs">{item.tooltip}</span>
            </a>
          ) : (
            <button
              key={idx}
              onClick={item.onClick}
              className="flex flex-col items-center space-y-1 p-2 text-slate-600 dark:text-navy-200"
            >
              {Icon}
              <span className="text-xs">{item.tooltip}</span>
            </button>
          );
        })}

        {/* Avatar (opens same dropdown) */}
        <Dropdown overlay={menu} trigger={["click"]} placement="top">
          <button className="flex flex-col items-center space-y-1 p-2">
            <div className="relative">
              <Avatar
                name={displayName}
                src={
                  typeof currentUser?.avatar === "string"
                    ? currentUser.avatar
                    : undefined
                }
                size="36"
                round={true}
                className="rounded-full"
              />
              <span className="absolute right-0 bottom-0 size-2.5 rounded-full border border-white bg-success dark:border-navy-700"></span>
            </div>
            <span className="text-xs">Profile</span>
          </button>
        </Dropdown>
      </div>
    </div>
  );

  // -------------------------------------------------
  //  Render
  // -------------------------------------------------
  return (
    <>
      {/* Choose layout */}
      {isMobile ? MobileBottomBar : DesktopSidebar}

      {/* Search Modal (shared) */}
      <Modal
        open={searchVisible}
        onCancel={() => setSearchVisible(false)}
        footer={null}
        width={600}
        closeIcon={null}
        centered
        bodyStyle={{ padding: 0 }}
        className="search-modal"
      >
        <div className="flex items-center bg-white dark:bg-navy-800 rounded-t-lg border-b border-slate-200 dark:border-navy-600">
          <Search
            placeholder="Search blogs, users, groups..."
            allowClear
            enterButton={<SearchOutlined className="text-lg" />}
            size="large"
            onSearch={(value) => {
              if (value.trim()) {
                navigate(`/search?q=${encodeURIComponent(value)}`);
                setSearchVisible(false);
              }
            }}
            className="w-full"
            autoFocus
          />
          <button
            onClick={() => setSearchVisible(false)}
            className="mx-4 text-slate-400 hover:text-slate-600 dark:text-navy-300 dark:hover:text-navy-100 flex items-center space-x-1"
          >
            <CloseCircleOutlined />
            <span className="text-xs">ESC</span>
          </button>
        </div>
        <div className="p-6 text-center text-slate-400 dark:text-navy-300">
          Type to search across the platform...
        </div>
      </Modal>

      {/* Custom modal styling (unchanged) */}
      <style jsx>{`
        .search-modal .ant-modal-content {
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
            0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        .search-modal
          .ant-input-search
          > .ant-input-group
          > .ant-input-group-addon
          > .ant-btn {
          background: #1890ff;
          border-color: #1890ff;
          color: white;
        }
        .search-modal .ant-input-search > .ant-input-group > .ant-input {
          border-radius: 8px 0 0 8px;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
