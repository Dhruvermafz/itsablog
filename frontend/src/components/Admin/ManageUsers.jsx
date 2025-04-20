import React from "react";
import { Table, Button, Tag } from "antd";

const users = [
  { id: 1, name: "Dhruv", role: "writer", email: "dhruv@example.com" },
  { id: 2, name: "Ravi", role: "reader", email: "ravi@example.com" },
];

const ManageUsers = () => {
  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Role",
      dataIndex: "role",
      render: (role) =>
        role === "writer" ? (
          <Tag color="blue">Writer</Tag>
        ) : (
          <Tag color="green">Reader</Tag>
        ),
    },
    {
      title: "Actions",
      render: () => <Button danger>Delete</Button>,
    },
  ];

  return <Table columns={columns} dataSource={users} rowKey="id" />;
};

export default ManageUsers;
