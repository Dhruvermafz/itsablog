import React from "react";
import { Progress, Space, Typography } from "antd";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";

// Define the fade-in animation for the label
const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
`;

// Styled components for enhanced styling
const SpinnerContainer = styled(Space)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: ${(props) => props.background || "rgba(255, 255, 255, 0.9)"};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
`;

// Styled Typography for the label
const StyledLabel = styled(Typography.Text)`
  margin-top: 16px;
  font-size: ${(props) =>
    props.size === "small" ? "12px" : props.size === "large" ? "18px" : "14px"};
  font-weight: 500;
  color: ${(props) => props.color || "#595959"};
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const Loading = ({
  label = "Loading...",
  size = "medium",
  showLabel = true,
  strokeColor = "#1890ff",
  background = "rgba(255, 255, 255, 0.9)",
  trailColor = "#e8ecef",
}) => {
  // Size logic for different progress sizes
  const progressSize = size === "small" ? 40 : size === "large" ? 100 : 60;
  const strokeWidth = size === "small" ? 6 : size === "large" ? 10 : 8;

  return (
    <SpinnerContainer background={background}>
      <Progress
        type="circle"
        percent={75} // Dynamic percentage can be passed as a prop if needed
        width={progressSize}
        showInfo={false} // Hide percentage text
        strokeWidth={strokeWidth}
        strokeColor={strokeColor} // Customizable stroke color
        trailColor={trailColor} // Customizable trail color
        strokeLinecap="round" // Rounded edges for a modern look
      />
      {showLabel && (
        <StyledLabel size={size} color={strokeColor}>
          {label}
        </StyledLabel>
      )}
    </SpinnerContainer>
  );
};

// PropTypes for type checking
Loading.propTypes = {
  label: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large"]),
  showLabel: PropTypes.bool,
  strokeColor: PropTypes.string,
  background: PropTypes.string,
  trailColor: PropTypes.string,
};

// Default props
Loading.defaultProps = {
  label: "Loading...",
  size: "medium",
  showLabel: true,
  strokeColor: "#1890ff", // Ant Design's default blue
  background: "rgba(255, 255, 255, 0.9)",
  trailColor: "#e8ecef",
};

export default Loading;
