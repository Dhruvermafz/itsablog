import React from "react";
import { Card, Col, Row, Typography, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const { Text } = Typography;

const GroupFeed = () => {
  const posts = [
    { content: "Excited for the new movie release!", user: "John", id: 1 },
    {
      content: "Just finished a new book, highly recommend it!",
      user: "Emily",
      id: 2,
    },
  ];

  const handleDelete = (id) => {
    // Delete post logic
    console.log("Deleting post:", id);
  };

  return (
    <div>
      <Row gutter={16}>
        {posts.map((post) => (
          <Col span={8} key={post.id}>
            <Card
              title={post.user}
              extra={
                <Button
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(post.id)}
                  type="text"
                />
              }
            >
              <Text>{post.content}</Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default GroupFeed;
