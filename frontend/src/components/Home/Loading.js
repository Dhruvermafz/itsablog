import React from "react";
import { Progress, Space, Typography } from "antd";
import PropTypes from "prop-types";

const Loading = ({ label, size, showLabel }) => {
  const progressSize = size === "small" ? 30 : size === "large" ? 80 : 50; // Size logic for different progress sizes

  return (
    <Space direction="vertical" align="center">
      <Progress
        type="circle"
        percent={75} // You can adjust the percent to simulate loading (e.g., 75% means it's still loading)
        width={progressSize}
        showInfo={false} // Hide percentage if you don't need it
        strokeWidth={8} // Adjust stroke width
      />
      {showLabel && (
        <Typography.Text type="secondary" style={{ marginTop: "16px" }}>
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
