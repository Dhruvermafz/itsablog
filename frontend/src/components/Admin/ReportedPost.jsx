import React from "react";
import { Table, Button, Tag } from "antd";

const data = [
  {
    id: 1,
    title: "Controversial Post",
    reporter: "user123",
    reason: "Abusive Language",
    status: "pending",
  },
];

const ReportedPosts = () => {
  const columns = [
    { title: "Post Title", dataIndex: "title" },
    { title: "Reported By", dataIndex: "reporter" },
    { title: "Reason", dataIndex: "reason" },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => (
        <Tag color={s === "pending" ? "red" : "green"}>{s.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Actions",
      render: () => (
        <>
          <Button type="link">View</Button>
          <Button type="link" danger>
            Remove Post
          </Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Reported Posts</h2>
      <Table columns={columns} dataSource={data} rowKey="id" />
    </div>
  );
};

export default ReportedPosts;
