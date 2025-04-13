import React from "react";
import { Typography, Space } from "antd";
import { Link } from "react-router-dom";
import { icon } from "../../static";

const { Text } = Typography;

const Banner = () => {
  return (
    <header
      style={{ padding: "16px 0", textAlign: "center", background: "#f0f2f5" }}
    >
      <Link
        to="/"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "inherit",
        }}
      >
        <img src={icon} alt="logo" style={{ width: 40, marginRight: 8 }} />
        <Space direction="vertical" size={0}>
          <Text strong style={{ fontSize: "24px" }}>
            ItsABlog
          </Text>
        </Space>
      </Link>
    </header>
  );
};

export default Banner;
