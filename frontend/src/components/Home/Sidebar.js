import React from "react";
import { Row, Col, Space } from "antd"; // Ant Design's layout components
import FindUsers from "../Extras/FindUsers";
import Footer from "./NavLinks";
import Loading from "./Loading";
import PostCard from "../Post/PostCard";
import TopPosts from "../Post/TopPosts";
import StickyWidget from "../Extras/StickyWidget";

const Sidebar = () => {
  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      <TopPosts />
      <FindUsers />
    </Space>
  );
};

export default Sidebar;
