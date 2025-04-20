import React from "react";
import { Table, Button, Input, Space } from "antd";

const data = [
  { id: 1, name: "Technology" },
  { id: 2, name: "Romance" },
  { id: 3, name: "Mythology" },
];

const ManageCategories = () => {
  const columns = [
    { title: "Category Name", dataIndex: "name" },
    {
      title: "Actions",
      render: () => (
        <>
          <Button type="link">Edit</Button>
          <Button type="link" danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Manage Categories</h2>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Input placeholder="Add New Category" />
        <Button type="primary">Add</Button>
        <Table columns={columns} dataSource={data} rowKey="id" />
      </Space>
    </div>
  );
};

export default ManageCategories;
