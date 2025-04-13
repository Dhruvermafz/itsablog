import React from "react";
import { Spin, Space, Typography } from "antd";
import PropTypes from "prop-types";

const Loading = ({ label, size, showLabel }) => {
  return (
    <Space direction="vertical" align="center">
      <Spin size={size} style={{ margin: "16px 0" }} />
      {showLabel && (
        <Typography.Text type="secondary" style={{ marginBottom: "24px" }}>
          {label || "Loading..."}
        </Typography.Text>
      )}
    </Space>
  );
};

Loading.propTypes = {
  label: PropTypes.string,
  size: PropTypes.string,
  showLabel: PropTypes.bool,
};

Loading.defaultProps = {
  size: "large",
  showLabel: true,
};

export default Loading;
