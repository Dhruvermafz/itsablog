import React, { useState } from "react";
import { Table, Tag, Button, message, Layout } from "antd";
import { useGetPostsQuery, useDeletePostMutation } from "../../api/postApi";
import Sidebar from "./Sidebar";
const ManagePosts = () => {
  const [page, setPage] = useState(1); // Track current page
  const { data, isLoading, error } = useGetPostsQuery({ page }); // Fetch posts with page
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();

  // Handle delete action
  const handleDelete = async (id) => {
    try {
      await deletePost(id).unwrap();
      message.success("Post deleted successfully");
    } catch (err) {
      message.error("Failed to delete post");
    }
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      render: (author) => author.username || "Unknown",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: () => "Uncategorized", // Adjust if category is added to Post model
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "published" ? (
          <Tag color="green">PUBLISHED</Tag>
        ) : (
          <Tag color="orange">PENDING</Tag>
        ),
    },
    {
      title: "Likes",
      dataIndex: "likeCount",
      key: "likeCount",
      render: (likeCount) => likeCount || 0, // Display like count
    },
    {
      title: "Comments",
      dataIndex: "commentCount",
      key: "commentCount",
      render: (commentCount) => commentCount || 0, // Display comment count
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button type="link">Review</Button>
          <Button
            type="link"
            danger
            onClick={() => handleDelete(record.id)}
            loading={isDeleting}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  // Handle loading and error states
  if (isLoading) return <div>Loading...</div>;
  if (error)
    return <div>Error: {error?.data?.message || "Failed to load posts"}</div>;

  // Map API response to Table dataSource
  const dataSource =
    data?.data?.map((post) => ({
      key: post._id,
      id: post._id,
      title: post.title,
      author: post.poster,
      category: "Uncategorized", // Adjust if category is added
      status: post.edited ? "edited" : "published", // Adjust based on actual status field
      likeCount: post.likeCount, // Map likeCount
      commentCount: post.commentCount, // Map commentCount
    })) || [];

  // Pagination configuration
  const pagination = {
    current: page,
    pageSize: 10,
    total: data?.count || 0, // Use count from API response
    onChange: (newPage) => setPage(newPage), // Update page state
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sidebar />
      <h2>Manage Posts</h2>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey="key"
        pagination={pagination}
      />
    </Layout>
  );
};

export default ManagePosts;
