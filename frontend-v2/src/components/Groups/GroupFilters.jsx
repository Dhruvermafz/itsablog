import React from "react";
import { Select, Space } from "antd";

const { Option } = Select;

const GroupFilters = ({ filters, onChange }) => {
  const handleCategoryChange = (category) => {
    onChange({ ...filters, category });
  };

  const handleSortChange = (sort) => {
    onChange({ ...filters, sort });
  };

  return (
    <Space>
      <Select
        value={filters.category}
        onChange={handleCategoryChange}
        style={{ width: 140 }}
      >
        <Option value="All">All Categories</Option>
        <Option value="Entertainment">Entertainment</Option>
        <Option value="Tech">Tech</Option>
        <Option value="Sports">Sports</Option>
        <Option value="Education">Education</Option>
      </Select>

      <Select
        value={filters.sort}
        onChange={handleSortChange}
        style={{ width: 120 }}
      >
        <Option value="new">Newest</Option>
        <Option value="popular">Popular</Option>
      </Select>
    </Space>
  );
};

export default GroupFilters;
