import React from "react";
import { Table, Button, Tag, Layout } from "antd";
import Sidebar from "./Sidebar";
const requests = [
  {
    id: 1,
    user: "Neha Sharma",
    email: "neha@example.com",
    requestedRole: "Writer",
    currentRole: "Reader",
  },
];

const RoleRequests = () => {
  const columns = [
    { title: "User", dataIndex: "user" },
    { title: "Email", dataIndex: "email" },
    {
      title: "Current Role",
      dataIndex: "currentRole",
      render: (r) => <Tag>{r}</Tag>,
    },
    {
      title: "Requested Role",
      dataIndex: "requestedRole",
      render: (r) => <Tag color="blue">{r}</Tag>,
    },
    {
      title: "Actions",
      render: () => (
        <>
          <Button type="link" style={{ color: "green" }}>
            Approve
          </Button>
          <Button type="link" danger>
            Reject
          </Button>
        </>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <h2>Role Change Requests</h2>
      <Table columns={columns} dataSource={requests} rowKey="id" />
    </Layout>
  );
};

export default RoleRequests;
