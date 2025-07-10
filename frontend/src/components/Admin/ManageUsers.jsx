import React from "react";
import { Table, Button, Tag, message, Layout } from "antd";
import { useGetAllUsersQuery, useDeleteUserMutation } from "../../api/userApi";
import Sidebar from "./Sidebar";
const ManageUsers = () => {
  const { data: users, isLoading, error } = useGetAllUsersQuery(); // Fetch users from API
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation(); // Delete user mutation

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      await deleteUser(id).unwrap();
      message.success("User deleted successfully");
    } catch (err) {
      message.error("Failed to delete user");
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "username", // Changed from 'name' to 'username' to match API data
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) =>
        role === "writer" ? (
          <Tag color="blue">Writer</Tag>
        ) : (
          <Tag color="green">Reader</Tag>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button
          danger
          onClick={() => handleDelete(record._id)} // Changed from 'record.id' to 'record._id'
          loading={isDeleting}
        >
          Delete
        </Button>
      ),
    },
  ];

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error)
    return <div>Error: {error?.data?.message || "Failed to load users"}</div>;

  // Ensure users.data exists before passing to Table
  const userData = users?.data || [];

  // Map user data to match Table expectations
  const dataSource = userData.map((user) => ({
    ...user,
    key: user._id, // Use _id as the key for the Table
    id: user._id, // Add id for compatibility with handleDelete
  }));

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <Table columns={columns} dataSource={dataSource} rowKey="_id" />
    </Layout>
  );
};

export default ManageUsers;
