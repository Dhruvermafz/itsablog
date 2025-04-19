import React, { useState } from "react";
import { Radio, Space } from "antd";

const TransitionOptions = ({ setTransitionOption }) => {
  const [value, setValue] = useState("none");

  const handleChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    setTransitionOption(newValue);
  };

  return (
    <Radio.Group onChange={handleChange} value={value}>
      <Space direction="horizontal">
        <Radio value="none">None</Radio>
        <Radio value="success">Success</Radio>
        <Radio value="failure">Failure</Radio>
        <Radio value="timeout">Timeout</Radio>
        <Radio value="no-internet">No Internet</Radio>
      </Space>
    </Radio.Group>
  );
};

export default TransitionOptions;
