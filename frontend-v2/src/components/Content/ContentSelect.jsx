import React, { useState } from "react";
import { Select, Typography, Space } from "antd";
import HorizontalStack from "../util/HorizontalStack";

const { Option } = Select;

const ContentSelect = () => {
  const [content, setContent] = useState("post");

  return (
    <HorizontalStack spacing={1}>
      <Typography.Text>Content:</Typography.Text>
      <Select
        size="small"
        value={content}
        style={{ minWidth: 150 }}
        onChange={(value) => setContent(value)}
      >
        <Option value="post">Posts</Option>
        <Option value="comment">Comments</Option>
      </Select>
    </HorizontalStack>
  );
};

export default ContentSelect;
