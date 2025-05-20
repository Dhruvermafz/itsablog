import React from "react";
import { Table, Button, Tag, message } from "antd";
import {
  useGetRandomUsersQuery,
  useDeleteUserMutation,
} from "../../api/userApi";
const ManageUsers = () => {
  const { data: users, isLoading, error } = useGetRandomUsersQuery(); // Fetch users from API
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
      render: (_, record) => (
        <Button
          danger
          onClick={() => handleDelete(record.id)}
          loading={isDeleting}
        >
          Delete
        </Button>
      ),
    },
  ];

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <Table columns={columns} dataSource={users} rowKey="id" />;
};

export default ManageUsers;
