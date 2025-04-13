import React from "react";
import { Menu } from "antd";
import {
  UserOutlined,
  GithubOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { routes } from "../../router/routes";
import { isLoggedIn, logoutUser } from "../../helpers/authHelper";

const NavLinks = ({ darkmode }) => {
  const user = isLoggedIn();

  const handleLogout = () => {
    logoutUser();
  };

  const menuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: <Link to={`${routes.PROFILE(user.username)}`}>Profile</Link>,
    },
    {
      key: "github",
      icon: <GithubOutlined />,
      label: (
        <a
          href="https://github.com/Dhruvermafz/social-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      ),
    },
    {
      key: "about",
      icon: <InfoCircleOutlined />,
      label: <Link to="/about">About</Link>,
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: <Link to="/settings">Settings</Link>,
    },
    {
      key: "discord",
      icon: <LockOutlined />,
      label: (
        <a
          href="https://discord.gg/n32dAAcCJY"
          target="_blank"
          rel="noopener noreferrer"
        >
          Discord
        </a>
      ),
    },
    {
      key: "logout",
      icon: <LockOutlined />,
      label: (
        <Link to="/" onClick={handleLogout}>
          Logout
        </Link>
      ),
    },
  ];

  return (
    <Menu
      items={menuItems}
      theme={darkmode ? "dark" : "light"}
      style={{
        backgroundColor: darkmode ? "#1A1B1E" : "white",
        color: darkmode ? "#c1c2c5" : "black",
        borderRadius: "4px",
        padding: "1rem",
        width: 180,
      }}
    />
  );
};

export default NavLinks;
