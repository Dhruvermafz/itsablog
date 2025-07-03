import React from "react";
import { Card, Typography, List, Avatar } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const LastCommentsWidget = ({ comments }) => {
  const navigate = useNavigate();

  return (
    <Card className="last-comments-widget">
      <Title level={5}>Last Comments</Title>
      <List
        dataSource={comments}
        renderItem={(comment) => (
          <List.Item className="comment-item">
            <List.Item.Meta
              avatar={<Avatar src={comment.avatar} />}
              title={
                <div>
                  <a
                    href={`/author/${comment.authorId}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/author/${comment.authorId}`);
                    }}
                  >
                    <strong>{comment.authorName}</strong>
                  </a>
                  <Text type="secondary" style={{ marginLeft: 8 }}>
                    {comment.date}
                  </Text>
                </div>
              }
              description={<Text type="secondary">{comment.content}</Text>}
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default LastCommentsWidget;
