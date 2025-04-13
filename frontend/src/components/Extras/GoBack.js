import React from "react";
import { Typography } from "antd";
import { Link } from "react-router-dom";

const GoBack = () => (
  <Typography.Link to="/" style={{ marginBottom: "2px" }}>
    &lt;&lt; Go back to posts
  </Typography.Link>
);

export default GoBack;
