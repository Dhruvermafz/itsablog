import React from "react";
import { Link } from "react-router-dom";
import { Typography } from "antd";

const { Text } = Typography;

const getCurrentYear = () => new Date().getFullYear();

const Copyright = () => {
  const currentYear = getCurrentYear();

  return (
    <div>
      <Text type="secondary">
        &copy; {currentYear} <Link to="/">ItsABlog</Link>. All rights reserved.{" "}
        <Link to="/terms">Terms of Use</Link> |{" "}
        <Link to="/privacy">Privacy Policy</Link> |{" "}
        <Link to="/license">License</Link>
      </Text>
    </div>
  );
};

export default Copyright;
