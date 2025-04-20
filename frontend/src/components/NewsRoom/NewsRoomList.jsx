import React from "react";
import { Card, Col, Row, Button, Typography } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const NewsroomList = () => {
  const posts = [
    {
      title: "Tech Innovations in 2025",
      content: "An in-depth look into the future of tech...",
      id: 1,
    },
    {
      title: "Health Benefits of Meditation",
      content: "Meditation helps with stress and anxiety...",
      id: 2,
    },
  ];

  const handleEdit = (id) => {
    // Edit post logic
    console.log("Editing post:", id);
  };

  const handleDelete = (id) => {
    // Delete post logic
    console.log("Deleting post:", id);
  };

  return (
    <div>
      <Title level={2}>Newsroom Posts</Title>
      <Row gutter={16}>
        {posts.map((post) => (
          <Col span={8} key={post.id}>
            <Card
              title={post.title}
              extra={
                <div>
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(post.id)}
                    style={{ marginRight: 8 }}
                  />
                  <Button
                    icon={<DeleteOutlined />}
                    onClick={() => handleDelete(post.id)}
                  />
                </div>
              }
            >
              <Text>{post.content.substring(0, 100)}...</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default NewsroomList;
