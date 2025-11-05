import React from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

const AntSpinner = (props) => {
  const antIcon = <LoadingOutlined style={{ fontSize: props.size }} spin />;

  return (
    <div className={`fadeIn ${props.spinning}`}>
      <Spin indicator={antIcon} />
    </div>
  );
};

export default AntSpinner;
