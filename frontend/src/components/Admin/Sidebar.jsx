import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  FileTextOutlined,
  FlagOutlined,
  TagsOutlined,
  SwitcherOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();

  const items = [
    { key: "/", icon: <DashboardOutlined />, label: "Dashboard" },
    { key: "users", icon: <UserOutlined />, label: "Manage Users" },
    { key: "posts", icon: <FileTextOutlined />, label: "Manage Posts" },
    { key: "categories", icon: <TagsOutlined />, label: "Categories" },
    { key: "roles", icon: <SwitcherOutlined />, label: "Role Requests" },
    { key: "reports", icon: <FlagOutlined />, label: "Reports" },
  ];

  return (
    <Sider collapsible>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["/"]}
        onClick={({ key }) => navigate(`/admin/${key}`)}
        items={items}
      />
    </Sider>
  );
};

export default Sidebar;
