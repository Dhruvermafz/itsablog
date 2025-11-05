import React from "react";
import { Select, Typography, Space } from "antd";
import { BiNoEntry } from "react-icons/bi";
import HorizontalStack from "../util/HorizontalStack";

const { Option } = Select;

const SortBySelect = ({ onSortBy, sortBy, sorts }) => {
  return (
    <HorizontalStack spacing={1}>
      <Typography.Text
        style={{
          display: "none",
          sm: "block",
        }}
      >
        Sort by:
      </Typography.Text>
      <Select
        size="small"
        value={sorts[sortBy]}
        style={{ minWidth: 150 }}
        onChange={onSortBy}
      >
        {Object.keys(sorts).map((sortName, i) => (
          <Option value={sorts[sortName]} key={i}>
            {sorts[sortName]}
          </Option>
        ))}
      </Select>
    </HorizontalStack>
  );
};

export default SortBySelect;
