import React, { useEffect, useState } from "react";
import { Avatar, Button, Card, Divider, Typography, Space, Spin } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { isLoggedIn } from "../../helpers/authHelper";
import ContentUpdateEditor from "../Content/ContentUpdateEditor";
import UserAvatar from "../UserModal/UserAvatar";
import HorizontalStack from "../util/HorizontalStack";

const { Text, Title, Paragraph } = Typography;

const Profile = (props) => {
  const [user, setUser] = useState(null);
  const currentUser = isLoggedIn();

  useEffect(() => {
    if (props.profile) {
      setUser(props.profile.user);
    }
  }, [props.profile]);

  return (
    <Card style={{ textAlign: "center", padding: "24px" }}>
      {user ? (
        <Space
          direction="vertical"
          size="middle"
          style={{ width: "100%", alignItems: "center" }}
        >
          <UserAvatar width={150} height={150} username={user.username} />

          <Title level={4}>{user.username}</Title>

          {props.editing ? (
            <ContentUpdateEditor
              handleSubmit={props.handleSubmit}
              originalContent={user.biography}
              validate={props.validate}
            />
          ) : user.biography ? (
            <Paragraph>
              <Text strong>Bio:</Text> {user.biography}
            </Paragraph>
          ) : (
            <Paragraph italic>No bio yet</Paragraph>
          )}

          {currentUser && user._id === currentUser.userId && (
            <Button
              icon={<EditOutlined />}
              onClick={props.handleEditing}
              type="primary"
            >
              {props.editing ? "Cancel" : "Edit bio"}
            </Button>
          )}

          {currentUser && user._id !== currentUser.userId && (
            <Button type="default" onClick={props.handleMessage}>
              Message
            </Button>
          )}

          <Divider />

          <HorizontalStack>
            <Text type="secondary">
              Likes <Text strong>{props.profile.posts.likeCount}</Text>
            </Text>
            <Text type="secondary">
              Posts <Text strong>{props.profile.posts.count}</Text>
            </Text>
          </HorizontalStack>
        </Space>
      ) : (
        <Spin tip="Loading profile..." />
      )}
    </Card>
  );
};

export default Profile;
