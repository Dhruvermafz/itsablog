import React from "react";
import { Table, Tag, Button } from "antd";

const data = [
  {
    id: 1,
    title: "The Rise of AI",
    author: "Dhruv Verma",
    category: "Tech",
    status: "published",
  },
  {
    id: 2,
    title: "Broken Butterflies",
    author: "Anonymous",
    category: "Poetry",
    status: "pending",
  },
];

const ManagePosts = () => {
  const columns = [
    { title: "Title", dataIndex: "title" },
    { title: "Author", dataIndex: "author" },
    { title: "Category", dataIndex: "category" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "published" ? "green" : "orange"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      render: () => (
        <>
          <Button type="link">Review</Button>
          <Button type="link" danger>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Manage Posts</h2>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
};

export default ManagePosts;
